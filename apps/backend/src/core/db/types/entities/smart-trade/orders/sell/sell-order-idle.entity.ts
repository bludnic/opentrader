import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SmartSellOrderIdle } from '../types';

export class SmartSellOrderIdleEntity implements SmartSellOrderIdle {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Idle;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderIdle) {
    Object.assign(this, order);
  }
}
