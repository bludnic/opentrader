import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SmartSellOrderFilled } from '../types';

export class SmartSellOrderFilledEntity implements SmartSellOrderFilled {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Filled;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderFilled) {
    Object.assign(this, order);
  }
}
