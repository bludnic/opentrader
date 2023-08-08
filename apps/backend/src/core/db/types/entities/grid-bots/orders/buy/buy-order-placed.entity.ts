import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { BuyOrderPlaced } from 'src/core/db/types/entities/grid-bots/orders/types';

export class BuyOrderPlacedEntity implements BuyOrderPlaced {
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Placed;

  constructor(order: BuyOrderPlaced) {
    Object.assign(this, order);
  }
}
