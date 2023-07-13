import { OrderSide } from "./types/order-side.type";
import { OrderStatus } from "./types/order-status.type";

export interface IOrder {
  orderId: string; // exchange order id
  clientOrderId?: string; // generated uniq id for exchange
  price: number;
  /**
   * `0` if order is not filled yet
   */
  fee: number;
  side: OrderSide;
  status: OrderStatus;
  quantity: number;
}