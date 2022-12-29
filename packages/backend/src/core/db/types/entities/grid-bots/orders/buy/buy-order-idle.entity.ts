import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
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
