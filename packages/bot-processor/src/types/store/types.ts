import { OrderStatusEnum, OrderType, XEntityType, XOrderSide, XSmartTradeType } from "@opentrader/types";

export type OrderPayload = {
  /**
   * Exchange account ID where the order will be placed.
   */
  exchange?: number;
  /**
   * Symbol to trade. If not provided, then the bot's default symbol will be used.
   */
  symbol?: string;
  type: OrderType;
  status?: OrderStatusEnum; // default to Idle
  price?: number; // if undefined, then it's a market order
  /**
   * Price deviation relative to entry price.
   * If 0.1, the order will be placed as entryPrice + 10%
   * If -0.1, the order will be placed as entryPrice - 10%
   */
  relativePrice?: number;
};

export interface AdditionalOrderPayload extends OrderPayload {
  quantity: number;
  entityType: XEntityType;
  side: XOrderSide;
}

export type CreateSmartTradePayload = {
  type: XSmartTradeType;
  buy: OrderPayload;
  sell?: OrderPayload;
  additionalOrders?: AdditionalOrderPayload[];
  quantity: number;
};
