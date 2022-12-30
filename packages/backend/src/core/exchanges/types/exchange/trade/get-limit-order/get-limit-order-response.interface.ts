import {
  OrderSide,
  OrderStatus,
} from 'src/core/exchanges/types/exchange/trade/common/types/order-side.type';

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
   * Order status.
   */
  status: OrderStatus;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
}
