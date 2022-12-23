import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SellOrderPlaced } from 'src/core/db/types/entities/grid-bots/orders/types';

export class SellOrderPlacedEntity implements SellOrderPlaced {
  id: string;
  price: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Placed;

  constructor(order: SellOrderPlaced) {
    Object.assign(this, order);
  }
}
