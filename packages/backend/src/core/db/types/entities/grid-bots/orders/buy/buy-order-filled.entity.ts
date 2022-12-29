import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
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
