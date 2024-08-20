import { OrderStatusEnum, OrderType, XSmartTradeType } from "@opentrader/types";

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
};

export type CreateSmartTradePayload = {
  type: XSmartTradeType;
  buy: OrderPayload;
  sell?: OrderPayload;
  quantity: number;
};
