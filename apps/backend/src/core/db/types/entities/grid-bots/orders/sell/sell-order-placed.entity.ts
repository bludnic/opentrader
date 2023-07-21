import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { SellOrderPlaced } from 'src/core/db/types/entities/grid-bots/orders/types';

export class SellOrderPlacedEntity implements SellOrderPlaced {
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Placed;

  constructor(order: SellOrderPlaced) {
    Object.assign(this, order);
  }
}
