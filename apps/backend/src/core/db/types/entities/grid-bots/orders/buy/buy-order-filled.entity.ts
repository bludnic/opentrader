import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { BuyOrderFilled } from 'src/core/db/types/entities/grid-bots/orders/types';

export class BuyOrderFilledEntity implements BuyOrderFilled {
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Filled;

  constructor(order: BuyOrderFilled) {
    Object.assign(this, order);
  }
}
