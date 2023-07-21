import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { BuyOrderIdle } from 'src/core/db/types/entities/grid-bots/orders/types';

export class BuyOrderIdleEntity implements BuyOrderIdle {
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Idle;

  constructor(order: BuyOrderIdle) {
    Object.assign(this, order);
  }
}
