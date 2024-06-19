export type IGetLimitOrderRequest = {
  /**
   * e.g. ADA/USDT
   */
  symbol: string;
  /**
   * Order ID provided by the exchange
   */
  orderId: string;
};

import type { OrderSide, OrderStatus } from "./common/enums.js";

export interface IGetLimitOrderResponse {
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
  status: OrderStatus;
  /**
   * Order fee.
   */
  fee: number;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
}
