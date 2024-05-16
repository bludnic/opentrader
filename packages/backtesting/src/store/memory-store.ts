import type {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from "@opentrader/bot-processor";
import type { IExchange } from "@opentrader/exchanges";
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
      sell: sell
        ? {
            price: sell.price,
            status: sell.status || OrderStatusEnum.Idle,
            createdAt,
            updatedAt: createdAt,
          }
        : undefined,
      quantity,
    };

    this.marketSimulator.addSmartTrade(smartTrade, ref);

    return smartTrade;
  }

  async updateSmartTrade(
    ref: string,
    payload: Pick<UseSmartTradePayload, "sell">,
    botId: number,
  ) {
    if (!payload.sell) {
      console.log(
        "MemoryStore: Unable to update smart trade. Reason: `payload.sell` not provided.",
      );
      return null;
    }

    const smartTrade = await this.getSmartTrade(ref, botId);

    if (!smartTrade) {
      return null;
    }

    const candlestick = this.marketSimulator.currentCandle;
    const updatedAt = candlestick.timestamp;

    if (smartTrade.sell) {
      console.log(
        "MemoryStore: SmartTrade already has a sell order. Skipping.",
      );
      return smartTrade;
    }

    const updatedSmartTrade: SmartTrade = {
      ...smartTrade,
      sell: {
        price: payload.sell.price,
        status: payload.sell.status || OrderStatusEnum.Idle,
        createdAt: updatedAt,
        updatedAt,
      },
    };

    return updatedSmartTrade;
  }

  async cancelSmartTrade(_ref: string, _botId: number): Promise<boolean> {
    return false; // @todo
    // throw new Error("Not implemented yet.");
  }

  async getExchange(_label: string): Promise<IExchange | null> {
    throw new Error("Not implemented yet.");
  }
}
