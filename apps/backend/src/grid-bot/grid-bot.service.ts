import {
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import big from 'big.js';
import { delay } from 'src/common/helpers/delay';
import { CreateGridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/create-grid-bot.dto';
import { GridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/grid-bot.dto';
import { GridBotEventCodeEnum } from 'src/core/db/types/common/enums/grid-bot-event-code.enum';
import { GridBotEventEntity } from 'src/core/db/types/entities/grid-bots/events/grid-bot-event.entity';
import { calcInitialInvestmentByGridLines } from 'src/grid-bot/utils/calcInitialInvestmentByGridLines';
import { v4 as uuidv4 } from 'uuid';

import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { IAccountAsset } from 'src/core/exchanges/types/exchange/account/account-asset/account-asset.interface';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { CreateBotRequestBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-request-body.dto';

import { MissingCurrencyOnExchangeException } from 'src/grid-bot/exceptions/missing-currency-on-exchange.exception';
import { NotEnoughFundsException } from 'src/grid-bot/exceptions/not-enough-funds.exception';
import { calculateInvestment } from 'src/grid-bot/utils/calculateInvestment';
import { SmartTradePublicService } from 'src/core/smart-trade/smart-trade-public.service';
import { SmartTradePrivateService } from 'src/core/smart-trade/smart-trade-private.service';
import { computeGridFromCurrentAssetPrice } from './utils/grid/computeGridFromCurrentAssetPrice';
import { IGridBotLevel } from "src/grid-bot/types/grid-bot-level.interface";
import { BotManagerService } from 'src/core/bot-manager/bot-manager.service';
import { GridBotControl } from './grid-bot-control';
import { useGridBot } from './use-grid-bot';

export class GridBotService {
  constructor(
    private exchange: IExchangeService,
    private firestore: FirestoreService,
    private smartTradePublicService: SmartTradePublicService,
    private smartTradePrivateService: SmartTradePrivateService,
    private readonly logger: Logger,
  ) {}

  async getBot(botId: string) {
    const bot = await this.firestore.gridBot.findOne(botId);
    this.logger.debug(`getBot with ID ${bot.id}`);

    return bot;
  }

  async getBots(): Promise<GridBotDto[]> {
    const bots = await this.firestore.gridBot.findAll();

    return bots.sort((left, right) => left.createdAt - right.createdAt);
  }

  async createBot(dto: CreateBotRequestBodyDto, user: IUser) {
    const currentAssetPrice = await this.getCurrentAssetPrice(
      dto.baseCurrency,
      dto.quoteCurrency,
    );
    const initialInvestment = calcInitialInvestmentByGridLines(
      dto.gridLines,
      currentAssetPrice,
    );

    const botEntity: CreateGridBotDto = {
      ...dto,
      initialInvestment,
    };
    const bot = await this.firestore.gridBot.create(botEntity, user.uid);

    this.logger.debug(
      `The bot ${bot.id} with pair ${bot.baseCurrency}/${bot.quoteCurrency} was created succesfully`,
      {
        gridLines: bot.gridLines,
        gridLinesLength: bot.gridLines.length,
      },
    );

    return bot;
  }

  async startBot(botId: string) {
    const bot = await this.firestore.gridBot.findOne(botId);
    const smartTrades = await this.smartTradePublicService.getAllByBotId(botId);

    if (!bot) {
      throw new NotFoundException(`Bot with "${botId}" not found`);
    }

    // @todo think about it
    // if (smartTrades.length > 0) {
    //   throw new ConflictException(
    //     `Bot already has opened Smart Trades. Need to fix @todo`,
    //   );
    // }

    const currentAssetPrice = await this.getCurrentAssetPrice(
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    this.logger.debug(
      `Current ${bot.baseCurrency} asset price is ${currentAssetPrice} ${bot.quoteCurrency}`,
    );

    const gridLevels = computeGridFromCurrentAssetPrice(
      bot.gridLines,
      currentAssetPrice,
    );
    this.logger.debug(
      `Calculate initial grid levels (total: ${gridLevels.length})`,
      gridLevels,
    );

    // Check enough funds to start the Bot
    this.logger.debug(`Check enough funds to start Bot`);
    await this.checkEnoughFundsToStartBot(bot, gridLevels);

    // Enable bot
    await this.firestore.gridBot.update(
      {
        enabled: true,
      },
      botId,
    );
    this.logger.debug('Bot has been enabled');

    await this.firestore.gridBotEvents.create(
      {
        id: uuidv4(),
        eventCode: GridBotEventCodeEnum.BotStarted,
        message: 'Bot has been enabled',
        data: null,
      },
      botId,
    );

    const updatedBot = await this.getBot(botId);

    // Run bot business logic once
    await this.runBotTemplate(updatedBot);

    return {
      bot: updatedBot,
      currentAssetPrice,
    };
  }

  async runBotTemplate(bot: GridBotDto) {
    const botControl = new GridBotControl(
      this.smartTradePublicService,
      this.exchange,
      bot,
      this.firestore,
      this.logger
    );

    const botManager = new BotManagerService(
      botControl,
      this.exchange,
    );

    await botManager.process(useGridBot);
  }

  async stopBot(botId: string) {
    const bot = await this.firestore.gridBot.findOne(botId);
    const smartTrades = await this.smartTradePublicService.getAllByBotId(botId);

    if (bot.smartTrades.length === 0) {
      throw new ConflictException(
        'Bot does not have no active Smart Trades. Nothing to clean.',
      );
    }

    await this.firestore.gridBot.updateSmartTradesRefs([], botId);

    await this.firestore.gridBot.update(
      {
        enabled: false,
      },
      botId,
    );

    this.logger.debug(`Bot has been stopped`);

    await this.firestore.gridBotEvents.create(
      {
        id: uuidv4(),
        eventCode: GridBotEventCodeEnum.BotStopped,
        message: 'Bot has been stopped',
        data: null,
      },
      botId,
    );
  }

  public async getCurrentAssetPrice(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<number> {
    const asset = await this.exchange.getMarketPrice({
      symbol: `${baseCurrency}-${quoteCurrency}`,
    });

    return asset.price;
  }

  private async getMakerTradingFee(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<number> {
    this.logger.log(`Get Trading Fee for ${baseCurrency}/${quoteCurrency}`);

    const { makerFee } = await this.exchange.getTradingFeeRates({
      baseCurrency,
      quoteCurrency,
    });

    this.logger.debug(
      `Trading Maker Fee for ${baseCurrency}/${quoteCurrency} is ${makerFee}`,
      makerFee,
    );

    return makerFee;
  }

  public async checkEnoughFundsToStartBot(
    bot: IGridBot,
    gridLevels: IGridBotLevel[],
  ): Promise<void> {
    const {
      baseCurrencyAmount: baseCurrencyAmountRequired,
      quoteCurrencyAmount: quoteCurrencyAmountRequired,
    } = calculateInvestment(gridLevels);
    const assets = await this.exchange.accountAssets();

    // check Base currency amount
    await this.checkEnoughBalance(
      bot.baseCurrency,
      baseCurrencyAmountRequired,
      assets,
    );

    // check Quote currency amount
    await this.checkEnoughBalance(
      bot.quoteCurrency,
      quoteCurrencyAmountRequired,
      assets,
    );
  }

  private async checkEnoughBalance(
    currencySymbol: string,
    requiredAmount: number,
    assets: IAccountAsset[],
  ): Promise<void> {
    const currencyAsset = assets.find(
      (asset) => asset.currency === currencySymbol,
    );

    if (!currencyAsset) {
      const errorMessage = `You dont have required asset ${currencySymbol} on your exchange account`;

      this.logger.debug(`[checkEnoughBalance] ${errorMessage}`);
      throw new MissingCurrencyOnExchangeException(errorMessage);
    }

    // availableBalance < requiredAmount
    if (big(currencyAsset.availableBalance).lt(requiredAmount)) {
      const errorMessage =
        `Not enough ${currencySymbol} funds to start the Bot. ` +
        `Balance: ${currencyAsset.balance}; ` +
        `Available Balance: ${currencyAsset.availableBalance}; ` +
        `Required Amount: ${requiredAmount}`;

      this.logger.debug(`[checkEnoughBalance]: ${errorMessage}`);
      throw new NotEnoughFundsException(errorMessage);
    }

    this.logger.debug(
      `[checkEnoughBalance]: Enough ${currencySymbol}. ` +
        `Balance: ${currencyAsset.balance}; ` +
        `Available Balance: ${currencyAsset.availableBalance}; ` +
        `Required Amount: ${requiredAmount}`,
    );
  }

  async getBotEvents(): Promise<GridBotEventEntity[]> {
    const events = await this.firestore.gridBotEvents.findAll();

    const sortedEvents = events.sort((a, b) => a.createdAt - b.createdAt);

    return sortedEvents;
  }
}
