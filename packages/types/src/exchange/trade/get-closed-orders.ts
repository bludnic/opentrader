import type { OrderSide, OrderStatus } from "./common/enums.js";

export interface IClosedOrder {
  /**
   * Exchange-supplied order ID.
   */
  exchangeOrderId: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId?: string;
  side: OrderSide;
  /**
   * Quantity to buy or sell.
   */
  quantity: number;
  /**
   * Order price.
   */
  price: number;
  /**
   * Filled price.
   */
  filledPrice: number | null;
  /**
   * Unix timestamp of the most recent trade on this order.
   */
  lastTradeTimestamp: number;
  /**
   * Order status.
   */
  status: Extract<OrderStatus, "filled" | "canceled">;
  /**
   * Order fee.
   */
  fee: number;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
}

export type IGetClosedOrdersRequest = {
  /**
   * e.g. ADA/USDT
   */
  symbol: string;
};

export type IGetClosedOrdersResponse = IClosedOrder[];
