import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { UseSmartTradePayload } from '../core/bot-manager/effects/common/types/use-smart-trade-effect';
import { IBotControl } from '../core/bot-manager/types/bot-control.interface';
import { TestingDb } from './testing-db';

export class TestBotControl implements IBotControl {
  constructor(private db: TestingDb, private entity: IGridBot) {}

  async stop() {
    console.log('Bot stopped');
  }

  async getSmartTrade(key: string): Promise<ISmartTrade | null> {
    const smartTradeRef = this.entity.smartTrades.find(
      (smartTradeRef) => smartTradeRef.key === key,
    );

    if (smartTradeRef) {
      return this.db.getSmartTrade(smartTradeRef.smartTradeId);
    }

    return null;
  }

  async createSmartTrade(
    key: string,
    payload: UseSmartTradePayload,
  ): Promise<ISmartTrade> {
    const smartTrade = this.db.createSmartTrade(key, {
      ...payload,
      exchangeAccountId: this.entity.exchangeAccountId,
      botId: this.entity.id,
    });

    const newSmartTrades = [...this.entity.smartTrades].filter(
      (smartTradeRef) => smartTradeRef.key !== key,
    );
    newSmartTrades.push({
      key,
      smartTradeId: smartTrade.id,
    });

    this.entity.smartTrades = newSmartTrades;

    return smartTrade;
  }

  id() {
    return this.entity.id;
  }

  exchangeAccountId() {
    return this.entity.exchangeAccountId;
  }

  baseCurrency() {
    return this.entity.baseCurrency;
  }

  quoteCurrency() {
    return this.entity.quoteCurrency;
  }
}
