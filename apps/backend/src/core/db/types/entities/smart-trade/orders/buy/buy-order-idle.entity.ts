import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SmartBuyOrderIdle } from '../types';

export class SmartBuyOrderIdleEntity implements SmartBuyOrderIdle {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Idle;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderIdle) {
    Object.assign(this, order);
  }
}
