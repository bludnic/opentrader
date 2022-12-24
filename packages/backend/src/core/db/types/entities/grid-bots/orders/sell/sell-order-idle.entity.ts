import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SellOrderIdle } from 'src/core/db/types/entities/grid-bots/orders/types';

export class SellOrderIdleEntity implements SellOrderIdle {
  clientOrderId: string;
  price: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Idle;

  constructor(order: SellOrderIdle) {
    Object.assign(this, order);
  }
}
