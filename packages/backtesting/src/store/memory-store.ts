import type {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from "@opentrader/bot-processor";
import { OrderStatusEnum } from "@opentrader/types";
import uniqueId from "lodash/uniqueId";
import type { MarketSimulator } from "../market-simulator";

export class MemoryStore implements IStore {
  /**
   * @internal
   */
  constructor(private marketSimulator: MarketSimulator) {}

  /**
   * @internal
   */
  getSmartTrades() {
    // Return only used smartTrades by the bot.
    // The smartTrade that doesn't contain a ref
    // was replaced by other smartTrade.
    const smartTrades = this.marketSimulator.smartTrades.filter(
      (smartTrade) => !!smartTrade.ref,
    );

    return [...smartTrades].sort(
      (left, right) => left.buy.price - right.buy.price,
    );
  }

  async stopBot() {
    return Promise.resolve();
  }

  async getSmartTrade(ref: string, _botId: number): Promise<SmartTrade | null> {
    const smartTrade = this.marketSimulator.smartTrades.find(
      (smartTrade) => smartTrade.ref === ref,
    );

    return smartTrade || null;
  }

  async createSmartTrade(
    ref: string,
    payload: UseSmartTradePayload,
    _botId: number,
  ): Promise<SmartTrade> {
    const candlestick = this.marketSimulator.currentCandle;

    const docId = uniqueId("id_");
    const { buy, sell, quantity } = payload;
    const createdAt = candlestick.timestamp;

    const smartTrade: SmartTrade = {
      id: docId,
      ref,
      buy: {
        price: buy.price,
        status: buy.status || OrderStatusEnum.Idle,
        createdAt,
        updatedAt: createdAt,
      },
      sell: {
        price: sell.price,
        status: sell.status || OrderStatusEnum.Idle,
        createdAt,
        updatedAt: createdAt,
      },
      quantity,
    };

    this.marketSimulator.addSmartTrade(smartTrade, ref);

    return smartTrade;
  }

  async cancelSmartTrade(_ref: string, _botId: number): Promise<boolean> {
    return false; // @todo
    // throw new Error("Not implemented yet.");
  }
}
