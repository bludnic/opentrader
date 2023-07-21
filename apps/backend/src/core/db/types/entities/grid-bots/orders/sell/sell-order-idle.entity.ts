import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SellOrderIdle } from 'src/core/db/types/entities/grid-bots/orders/types';

export class SellOrderIdleEntity implements SellOrderIdle {
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Idle;

  constructor(order: SellOrderIdle) {
    Object.assign(this, order);
  }
}
