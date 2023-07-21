import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SellOrderFilled } from 'src/core/db/types/entities/grid-bots/orders/types';

export class SellOrderFilledEntity implements SellOrderFilled {
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Filled;

  constructor(order: SellOrderFilled) {
    Object.assign(this, order);
  }
}
