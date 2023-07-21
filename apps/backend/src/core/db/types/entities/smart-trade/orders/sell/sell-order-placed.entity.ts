import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SmartSellOrderPlaced } from '../types';

export class SmartSellOrderPlacedEntity implements SmartSellOrderPlaced {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Placed;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderPlaced) {
    Object.assign(this, order);
  }
}
