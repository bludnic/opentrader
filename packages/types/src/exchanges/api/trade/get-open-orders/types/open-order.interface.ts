import type {
  OrderStatus,
  OrderSide,
} from "src/exchanges/api/trade/common/types";

export interface IOpenOrder {
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
  filledPrice: null;
  /**
   * Unix timestamp of the most recent trade on this order.
   */
  lastTradeTimestamp: number;
  /**
   * Order status.
   */
  status: Extract<OrderStatus, "open">;
  /**
   * Order fee.
   */
  fee: number;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
}
