import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
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
