import { OrderSide, OrderStatus } from "src/exchanges/api/trade/common/types";

export interface IGetLimitOrderResponse {
  /**
   * Exchange-supplied order ID.
   */
  exchangeOrderId: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId: string;
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
