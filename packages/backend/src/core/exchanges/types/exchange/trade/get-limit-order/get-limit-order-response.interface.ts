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
   * Fee.
   *
   * Negative number represents the user transaction fee charged by the platform.
   * Positive number represents rebate.
   *
   * fee in Base Currency, if `order.side == "buy"`
   * fee in Quote Currency, if `order.side == "sell"`
   */
  fee: number;
  /**
   * Order status.
   */
  status: OrderStatus;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  createdAt: number;
}
