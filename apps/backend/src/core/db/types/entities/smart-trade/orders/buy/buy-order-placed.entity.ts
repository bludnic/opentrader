import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SmartBuyOrderPlaced } from '../types';

export class SmartBuyOrderPlacedEntity implements SmartBuyOrderPlaced {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Placed;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderPlaced) {
    Object.assign(this, order);
  }
}
