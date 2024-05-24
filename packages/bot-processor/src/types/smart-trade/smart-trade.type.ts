import type { OrderStatusEnum, OrderType } from "@opentrader/types";

type OrderBuilder<T extends OrderType, S extends OrderStatusEnum> = {
  type: T;
  status: S;
  price: T extends "Limit" ? number : undefined;
  filledPrice: S extends "filled" ? number : undefined;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
  /**
   * Updated time (e.g., update status to Filled), Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  updatedAt: number;
};

export type LimitOrderIdle = OrderBuilder<"Limit", "idle">;
export type LimitOrderPlaced = OrderBuilder<"Limit", "placed">;
export type LimitOrderFilled = OrderBuilder<"Limit", "filled">;
export type MarketOrderIdle = OrderBuilder<"Market", "idle">;
export type MarketOrderPlaced = OrderBuilder<"Market", "placed">;
export type MarketOrderFilled = OrderBuilder<"Market", "filled">;

export type LimitOrder = LimitOrderIdle | LimitOrderPlaced | LimitOrderFilled;
export type MarketOrder =
  | MarketOrderIdle
  | MarketOrderPlaced
  | MarketOrderFilled;

export type Order = LimitOrder | MarketOrder;

type SmartTradeBuilder<WithSell extends boolean> = {
  id: number | string; // @todo remove this prop, the bot processor is not required to know the ID of the bot
  ref: string;
  quantity: number;
  buy: Order;
  sell: WithSell extends true ? Order : undefined;
};

export type SmartTradeBuyOnly = SmartTradeBuilder<false>;
export type SmartTradeWithSell = SmartTradeBuilder<true>;

export type SmartTrade = SmartTradeBuyOnly | SmartTradeWithSell;
