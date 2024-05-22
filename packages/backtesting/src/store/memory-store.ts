import {
  IStore,
  Order,
  SmartTrade,
  UseSmartTradePayload,
} from "@opentrader/bot-processor";
import type { IExchange } from "@opentrader/exchanges";
import { OrderStatusEnum, OrderType } from "@opentrader/types";
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

    return [...smartTrades].sort((left, right) => {
      return (left.buy?.price || 0) - (right.buy?.price || 0);
    });
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

    let buyOrder: Order;
    let sellOrder: Order | undefined = undefined;

    const buyOrderStatus = buy.status || OrderStatusEnum.Idle;

    if (buy.type === OrderType.Market) {
      switch (buyOrderStatus) {
        case "filled":
          if (!buy.price) {
            throw new Error(`Bought "price" is required for sell only trades`);
          }
          buyOrder = {
            type: OrderType.Market,
            price: undefined,
            filledPrice: buy.price,
            status: OrderStatusEnum.Filled,
            createdAt,
            updatedAt: createdAt,
          };
          break;
        case "placed":
          throw new Error('Marking TP order as "placed" is not supported');
        case "idle":
          buyOrder = {
            type: OrderType.Market,
            price: undefined,
            filledPrice: undefined,
            status: OrderStatusEnum.Idle,
            createdAt,
            updatedAt: createdAt,
          };
          break;
        default:
          throw new Error("Invalid order status");
      }
    } else {
      // Limit
      if (!buy.price) {
        throw new Error(`"price" is required for Limit entry order`);
      }

      switch (buy.status) {
        case "filled":
          buyOrder = {
            type: OrderType.Limit,
            price: buy.price,
            filledPrice: buy.price,
            status: OrderStatusEnum.Filled,
            createdAt,
            updatedAt: createdAt,
          };
          break;
        case "placed":
          throw new Error('Marking TP order as "placed" is not supported');
        case "idle":
          buyOrder = {
            type: OrderType.Limit,
            price: buy.price,
            filledPrice: undefined,
            status: OrderStatusEnum.Idle,
            createdAt,
            updatedAt: createdAt,
          };
          break;
        default:
          throw new Error(`Invalid order status: ${buy.status}`);
      }
    }

    if (sell?.type === "Market") {
      switch (sell.status) {
        case "filled":
          throw new Error('Marking TP order as "filled" is not supported');
        case "placed":
          throw new Error('Marking TP order as "placed" is not supported');
        case "idle":
          sellOrder = {
            type: OrderType.Market,
            price: undefined,
            filledPrice: undefined,
            status: OrderStatusEnum.Idle,
            createdAt,
            updatedAt: createdAt,
          };
          break;
        default:
          throw new Error(`Invalid order status: ${sell.status}`);
      }
    } else if (sell?.type === "Limit") {
      if (!sell.price) {
        throw new Error(`"price" is required for Limit sell orders`);
      }

      switch (sell.status) {
        case "filled":
          throw new Error('Marking TP order as "filled" is not supported');
        case "placed":
          throw new Error('Marking TP order as "placed" is not supported');
        case "idle":
          sellOrder = {
            type: OrderType.Limit,
            price: sell.price,
            filledPrice: undefined,
            status: OrderStatusEnum.Idle,
            createdAt,
            updatedAt: createdAt,
          };
          break;
        default:
          throw new Error(`Invalid order status: ${sell.status}`);
      }
    }

    const smartTrade: SmartTrade = {
      id: docId,
      ref,
      buy: buyOrder,
      sell: sellOrder,
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

    const orderStatus = payload.sell.status || OrderStatusEnum.Idle;

    let order: Order;

    if (payload.sell.type === OrderType.Market) {
      switch (orderStatus) {
        case "filled":
          throw new Error('Marking TP order as "filled" is not supported');
        case "placed":
          throw new Error('Marking TP order as "placed" is not supported');
        case "idle":
          order = {
            type: OrderType.Market,
            price: undefined,
            filledPrice: undefined,
            status: OrderStatusEnum.Idle,
            createdAt: updatedAt,
            updatedAt,
          };
          break;
        default:
          throw new Error("Invalid order status");
      }
    } else {
      if (!payload.sell.price) {
        throw new Error(`"price" is required for Limit sell orders`);
      }

      switch (orderStatus) {
        case "filled":
          throw new Error('Marking TP order as "filled" is not supported');
        case "placed":
          throw new Error('Marking TP order as "placed" is not supported');
        case "idle":
          order = {
            type: OrderType.Limit,
            price: payload.sell.price,
            filledPrice: undefined,
            status: OrderStatusEnum.Idle,
            createdAt: updatedAt,
            updatedAt,
          };
          break;
        default:
          throw new Error("Invalid order status");
      }
    }

    return {
      ...smartTrade,
      sell: order,
    };
  }

  async cancelSmartTrade(_ref: string, _botId: number): Promise<boolean> {
    return false; // @todo
    // throw new Error("Not implemented yet.");
  }

  async getExchange(_label: string): Promise<IExchange | null> {
    throw new Error("Not implemented yet.");
  }
}
