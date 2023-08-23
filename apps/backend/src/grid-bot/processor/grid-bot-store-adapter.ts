import {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from '@bifrost/bot-processor';
import { Logger } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { CreateSmartTradeDto } from 'src/core/db/firestore/repositories/smart-trade/dto/create-smart-trade/create-smart-trade.dto';
import { toSmartTradeIteratorResult } from 'src/common/processor/utils';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';

export class GridBotStoreAdapter implements IStore {
  constructor(
    private bot: IGridBot,
    private firestore: FirestoreService,
    private logger: Logger,
    private stopBotFn: (botId: string) => Promise<void>,
  ) {}

  stopBot(botId: string): Promise<void> {
    return this.stopBotFn(botId);
  }

  async getSmartTrade(key: string, botId: string): Promise<SmartTrade | null> {
    const botEntity = await this.firestore.gridBot.findOne(botId);

    if (!botEntity)
      throw new Error(
        `[GridBotStateManagement] getSmartTrade(): botId ${botId} not found`,
      );

    const smartTradeRef = botEntity.smartTrades.find(
      (smartTrade) => smartTrade.key === key,
    );

    if (smartTradeRef) {
      try {
        const smartTrade = await this.firestore.smartTrade.findOne(
          smartTradeRef.smartTradeId,
        );

        return toSmartTradeIteratorResult(smartTrade);
      } catch {
        return null; // throws error if not found
      }
    }

    return null;
  }

  async createSmartTrade(
    key: string,
    payload: UseSmartTradePayload,
    botId: string,
  ) {
    this.logger.debug(`[GridBotStateManagement] createSmartTrade (key:${key})`);

    const botEntity = await this.firestore.gridBot.findOne(botId);
    if (!botEntity)
      throw new Error(
        `[GridBotStateManagement] getSmartTrade(): botId ${botId} not found`,
      );

    const dto: CreateSmartTradeDto = {
      baseCurrency: this.bot.baseCurrency,
      quoteCurrency: this.bot.quoteCurrency,
      buy: {
        price: payload.buy.price,
        status: payload.buy.status,
      },
      sell: {
        price: payload.sell.price,
        status: payload.sell.status,
      },
      quantity: payload.quantity,
      botId: botId,
      exchangeAccountId: botEntity.exchangeAccountId,
    };
    const smartTrade = await this.firestore.smartTrade.create(
      dto,
      botEntity.userId,
    );

    await this.firestore.gridBot.updateSmartTradeRef(
      {
        key,
        smartTradeId: smartTrade.id,
      },
      botEntity.id,
    );

    this.logger.debug(
      `[GridBotControl] Smart Trade with (key:${key}) was saved to DB`,
    );

    return toSmartTradeIteratorResult(smartTrade);
  }
}
