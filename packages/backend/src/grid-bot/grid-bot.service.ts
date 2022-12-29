import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import big from 'big.js';
import { delay } from 'src/common/helpers/delay';
import { CreateCompletedDealDto } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/dto/create-completed-deal.dto';
import { GridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/grid-bot.dto';
import { GridBotEventCodeEnum } from 'src/core/db/types/common/enums/grid-bot-event-code.enum';
import { GridBotEventEntity } from 'src/core/db/types/entities/grid-bots/events/grid-bot-event.entity';
import { IPlaceLimitOrderResponse } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-response.interface';
import { CompletedDealWithProfitDto } from 'src/grid-bot/dto/get-completed-deals/types/completed-deal-with-profit.dto';
import { getCompletedDealsFromCurrentDeals } from 'src/grid-bot/utils/completed-deals/getCompletedDealsFromCurrentDeals';
import { populateCompletedDealWithProfit } from 'src/grid-bot/utils/completed-deals/populateCompletedDealWithProfit';
import { generateUniqId } from 'src/grid-bot/utils/generateUniqId';
import { v4 as uuidv4 } from 'uuid';

import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import {
  DealBuyFilled,
  DealSellFilled,
  IDeal,
} from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { IAccountAsset } from 'src/core/exchanges/types/exchange/account/account-asset/account-asset.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { DefaultExchangeServiceFactorySymbol } from 'src/core/exchanges/utils/default-exchange.factory';
import { CreateBotRequestBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-request-body.dto';

import { SyncBotResponseBodyDto } from 'src/grid-bot/dto/sync-bot/sync-bot-response-body.dto';
import { MissingCurrencyOnExchangeException } from 'src/grid-bot/exceptions/missing-currency-on-exchange.exception';
import { NotEnoughFundsException } from 'src/grid-bot/exceptions/not-enough-funds.exception';
import { SyncedDealDto } from 'src/grid-bot/types/service/sync/synced-deal.dto';
import { calculateInvestment } from 'src/grid-bot/utils/calculateInvestment';
import { calculateLimitOrdersFromDeals } from 'src/grid-bot/utils/calculateLimitOrdersFromDeals';
import { calcInitialDealsByAssetPrice } from 'src/grid-bot/utils/deals/calcInitialDealsByAssetPrice';
import { mapLimitOrdersToPlacedDeals } from 'src/grid-bot/utils/dto/mapLimitOrdersToPlacedDeals';
import { checkOrderFilled } from 'src/grid-bot/utils/orders/checkOrderFilled';
import { recalculateDeals } from 'src/grid-bot/utils/recalculateDeals';
import { recalculateDealsDiff } from 'src/grid-bot/utils/recalculateDealsDiff';

@Injectable({
  scope: Scope.REQUEST,
})
export class GridBotService {
  constructor(
    @Inject(DefaultExchangeServiceFactorySymbol)
    private exchange: IExchangeService,
    private firestore: FirestoreService,
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
    const bot = await this.firestore.gridBot.create(dto, user.uid);

    this.logger.debug(
      `The bot ${bot.id} with pair ${bot.baseCurrency}/${bot.quoteCurrency} was created succesfully`,
      {
        gridLevels: bot.gridLevels,
        quantityPerGrid: bot.quantityPerGrid,
        highPrice: bot.highPrice,
        lowPrice: bot.lowPrice,
      },
    );

    return bot;
  }

  async startBot(botId: string) {
    const bot = await this.firestore.gridBot.findOne(botId);

    if (!bot) {
      throw new NotFoundException(`Bot with "${botId}" not found`);
    }

    if (bot.deals.length > 0) {
      throw new ConflictException(
        `Bot already has opened deals. Need to fix @todo`,
      );
    }

    const currentAssetPrice = await this.getCurrentAssetPrice(
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    this.logger.debug(
      `Current ${bot.baseCurrency} asset price is ${currentAssetPrice} ${bot.quoteCurrency}`,
    );

    const initialDeals = calcInitialDealsByAssetPrice(bot, currentAssetPrice);
    this.logger.debug(
      `Calculate initial deals (total: ${initialDeals.length})`,
      {
        deals: initialDeals.map((deal) => ({
          id: deal.id,
          buyPrice: deal.buyOrder.price,
          sellPrice: deal.sellOrder.price,
          status: deal.status,
        })),
      },
    );

    // Check enough funds to start the Bot
    this.logger.debug(`Check enough funds to start Bot`);
    await this.checkEnoughFundsToStartBot(bot, initialDeals);

    const limitOrders = calculateLimitOrdersFromDeals(initialDeals, bot);
    this.logger.debug(
      `Prepare limit orders to be placed (total: ${limitOrders.length})`,
      {
        limitOrders: limitOrders.map((limitOrder) => ({
          clientOrderId: limitOrder.clientOrderId,
          price: limitOrder.price,
        })),
      },
    );

    const placedLimitOrders = await this.placeOrders(limitOrders);
    this.logger.debug(
      `Limit orders placed successfully (total: ${placedLimitOrders.length})`,
      {
        placedLimitOrders: placedLimitOrders.map((order) => ({
          orderId: order.orderId,
          clientOrderId: order.clientOrderId,
        })),
      },
    );

    placedLimitOrders.forEach((limitOrder) => {
      if (!limitOrder.orderId) {
        this.logger.error(
          `Order is missing "orderId" field. Possible reason: Order with "clientOrderId: ${limitOrder.clientOrderId}" already exists on the exchange`,
          limitOrder,
        );
      }
    });

    await this.firestore.gridBot.updateDeals(initialDeals, botId);
    this.logger.debug(`All ${initialDeals.length} initial deals saved to DB`);

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

    return {
      bot: updatedBot,
      currentAssetPrice,
    };
  }

  async stopBot(botId: string) {
    const bot = await this.firestore.gridBot.findOne(botId);

    if (bot.deals.length === 0) {
      throw new ConflictException(
        'Bot does not have open orders. Nothing to stop.',
      );
    }

    await this.stopAllOrders(bot);

    await this.firestore.gridBot.updateDeals([], botId);

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

  private async placeOrders(
    placeOrders: IPlaceLimitOrderRequest[],
  ): Promise<IPlaceLimitOrderResponse[]> {
    const placedOrders: IPlaceLimitOrderResponse[] = [];

    for (const orderToPlace of placeOrders) {
      const order = await this.exchange.placeLimitOrder(orderToPlace);
      placedOrders.push(order);
      this.logger.debug(
        `Order with id ${orderToPlace.clientOrderId} was placed`,
        order,
      );
      console.log('order', order);

      await delay(1000);
    }

    return placedOrders;
  }

  private async stopAllOrders(bot: IGridBot) {
    for (const deal of bot.deals) {
      // `too many requests` если отправлять запросы с меньшим интервалом
      // нужно прикрутить батчинг для отмены ордеров пачкой

      if (deal.buyOrder) {
        await this.exchange.cancelLimitOrder({
          clientOrderId: deal.buyOrder.clientOrderId,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });
        this.logger.debug(
          `Buy order with ${deal.buyOrder.clientOrderId} was cancelled`,
        );

        await delay(1000);
      }

      if (deal.sellOrder) {
        await this.exchange.cancelLimitOrder({
          clientOrderId: deal.sellOrder.clientOrderId,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });
        this.logger.debug(
          `Sell order with ${deal.sellOrder.clientOrderId} was cancelled`,
        );

        await delay(1000);
      }
    }
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

  /**
   * Синхронизация делится на два этапа:
   *
   * 1. Синхронизация статуса заполненных ордеров на бирже -> БД
   * 2. Перерасчет ордеров которые нужно выставить на биржу
   * 2.a. Выставление Limit ордеров на биржу
   * 2.b. Сохранение нового списка Deals в БД
   *
   * @param botId
   */
  async syncMarketOrders(botId: string): Promise<SyncBotResponseBodyDto> {
    let bot = await this.firestore.gridBot.findOne(botId);

    if (!bot.enabled) {
      throw new ConflictException('Bot not started. Start the bot first.');
    }

    this.logger.debug(`Start syncing bot ${bot.id}`);

    const currentAssetPrice = await this.getCurrentAssetPrice(
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    this.logger.debug(
      `Current ${bot.baseCurrency} asset price is ${currentAssetPrice} ${bot.quoteCurrency}`,
    );

    // Sync filled statuses of the limits orders with Deals
    this.logger.debug('Start syncing limit orders filled status with DB');
    const syncedDeals = await this.syncFilledStatus(bot);

    bot = await this.getBot(botId); // get actual deals after sync

    // Save completed deals to DB
    this.logger.debug('Get Completed Deals from current Deals');
    const completedDeals = getCompletedDealsFromCurrentDeals(bot.deals);
    this.logger.debug(`Completed deals amount: ${completedDeals.length}`, {
      completedDeals,
    });

    if (completedDeals.length > 0) {
      await this.saveCompletedDeals(completedDeals, bot);
    }

    // Recalculate deals after updating filled status
    this.logger.debug('Starting the process of recalculating new deals');
    const newDeals = recalculateDeals(bot.deals);
    const newDealsDiff = recalculateDealsDiff(bot.deals);
    this.logger.debug('Recalculate new deals diff', {
      newDealsDiff,
    });

    const limitOrders = calculateLimitOrdersFromDeals(newDealsDiff, bot);

    // Maybe it's to much information for logging in the `IPlaceLimitOrderRequest` type.
    //
    // Would be better to simplify this interface into something like `type SimpleDeal`,
    // which contains `price` and `side` properties only.
    this.logger.debug('Calculate limit orders from dealsDiff', {
      limitOrders,
    });

    this.logger.debug(`Placing limit orders (total: ${limitOrders.length})...`);

    // Вангую тут проблему.
    // Если один из запросов `placeOrder` упадет -- в БД ничего не запишется.
    // В итоге на бирже некоторые ордера будут созданы но в базе их не будет.
    // Получится разсинхрон.
    //
    // Возможное решение:
    // 1. Ставить по одному placeOrder
    // 2. При успешном ответе сохранять в базу
    // 3. При неуспешном ответе, ордер на бирже не создастся, и в БД соответственно
    // тоже не запишется. Это обеспечит "атомарность" операции.
    const exchangeOrders = await this.placeOrders(limitOrders);
    this.logger.debug(
      `Limit orders placed successfully (total: ${exchangeOrders.length})`,
    );

    await this.firestore.gridBot.updateDeals(newDeals, botId);
    this.logger.debug('Deals updated');

    const result: SyncBotResponseBodyDto = {
      message: 'Deals synced successfully',
      currentAssetPrice,
      filledOrders: syncedDeals,
      placedOrders: mapLimitOrdersToPlacedDeals(limitOrders),
    };

    // Save event only if something happened
    // (too much events, especially when testing)
    if (result.filledOrders.length > 0) {
      await this.firestore.gridBotEvents.create(
        {
          id: uuidv4(),
          eventCode: GridBotEventCodeEnum.BotSynced,
          message: 'Bot synced successfully',
          data: result,
        },
        botId,
      );
    }

    return result;
  }

  /**
   * Проверяем статус лимит ордеров на бирже.
   * Если ордер заполнен то обновляем статус в БД.
   *
   * @param bot
   */
  async syncFilledStatus(bot: IGridBot): Promise<SyncedDealDto[]> {
    const syncedDeals: SyncedDealDto[] = [];

    for (const deal of bot.deals) {
      this.logger.log(`Start syncing deal: #${deal.id}`);

      if (deal.status === DealStatusEnum.Idle) {
        // Order not placed yet, nothing to do.
        //
        // This scenario shouldn't happen, because after
        // the bot is started such status should not exist.
      } else if (deal.status === DealStatusEnum.BuyPlaced) {
        const limitBuyOrder = await this.exchange.getLimitOrder({
          clientOrderId: deal.buyOrder.clientOrderId,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });

        if (checkOrderFilled(limitBuyOrder)) {
          const newDeal: DealBuyFilled = {
            ...deal,
            id: deal.id,
            buyOrder: {
              ...deal.buyOrder,
              status: OrderStatusEnum.Filled,
              fee: limitBuyOrder.fee, // update filled order fee
            },
            status: DealStatusEnum.BuyFilled,
          };

          await this.firestore.gridBot.updateDeal(deal.id, bot.id, newDeal);
          this.logger.debug(
            `[BUY] Limit order was FILLED with price: ${limitBuyOrder.price} ${bot.quoteCurrency}`,
          );

          syncedDeals.push({
            dealId: deal.id,
            buyOrder: {
              price: deal.buyOrder.price,
              fee: deal.buyOrder.fee, // update filled order fee
              status: OrderStatusEnum.Filled,
              current: false,
            },
          });
        } else {
          this.logger.debug(
            `[BUY] Limit order with price: ${limitBuyOrder.price} ${bot.quoteCurrency} is not filled yet`,
          );
        }
      } else if (deal.status === DealStatusEnum.BuyFilled) {
        // order status was already synced, nothing to do
      } else if (deal.status === DealStatusEnum.SellPlaced) {
        const limitSellOrder = await this.exchange.getLimitOrder({
          clientOrderId: deal.sellOrder.clientOrderId,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });

        if (checkOrderFilled(limitSellOrder)) {
          const newDeal: DealSellFilled = {
            ...deal,
            sellOrder: {
              ...deal.sellOrder,
              status: OrderStatusEnum.Filled,
              fee: limitSellOrder.fee,
            },
            status: DealStatusEnum.SellFilled,
          };

          await this.firestore.gridBot.updateDeal(deal.id, bot.id, newDeal);
          this.logger.debug(
            `[SELL] Limit order was FILLED with price: ${limitSellOrder.price} ${bot.quoteCurrency}`,
          );
          syncedDeals.push({
            dealId: deal.id,
            sellOrder: {
              price: deal.sellOrder.price,
              fee: deal.sellOrder.fee,
              status: OrderStatusEnum.Filled,
              current: false,
            },
          });
        } else {
          this.logger.debug(
            `[SELL] Limit order with price: ${limitSellOrder.price} ${bot.quoteCurrency} is not filled yet`,
          );
        }
      } else if (deal.status === DealStatusEnum.SellFilled) {
        // order status was already synced, nothing to do
      }
    }

    return syncedDeals;
  }

  public async checkEnoughFundsToStartBot(
    bot: IGridBot,
    deals: IDeal[],
  ): Promise<void> {
    const {
      baseCurrencyAmount: baseCurrencyAmountRequired,
      quoteCurrencyAmount: quoteCurrencyAmountRequired,
    } = calculateInvestment(deals, bot.quantityPerGrid);
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
      const errorMessage = `Missing currency asset ${currencyAsset} on the exchange`;

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

  private async saveCompletedDeals(
    completedDeals: CreateCompletedDealDto[],
    bot: IGridBot,
  ): Promise<void> {
    this.logger.debug('Process of saving CompletedDeals started');

    for (const deal of completedDeals) {
      const dealId = generateUniqId();

      this.logger.debug(`Save CompletedDeal ${dealId}`);
      await this.firestore.gridBotCompletedDeals.create(deal, dealId, bot.id);
      this.logger.debug(`CompletedDeal saved successfully ${dealId}`);
    }

    this.logger.debug(
      `Process of saving CompletedDeals completed successfully`,
    );
  }

  async getCompletedDeals(): Promise<CompletedDealWithProfitDto[]> {
    const deals = await this.firestore.gridBotCompletedDeals.findAll();
    const dealsWithProfit = deals.map((deal) =>
      populateCompletedDealWithProfit(deal),
    );

    const sortedDeals = dealsWithProfit.sort(
      (a, b) => a.createdAt - b.createdAt,
    );

    return sortedDeals;
  }

  async getBotEvents(): Promise<GridBotEventEntity[]> {
    const events = await this.firestore.gridBotEvents.findAll();

    const sortedEvents = events.sort((a, b) => a.createdAt - b.createdAt);

    return sortedEvents;
  }
}
