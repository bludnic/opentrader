import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SmartBuyOrderIdle } from "../types";

export class SmartBuyOrderIdleEntity implements SmartBuyOrderIdle {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Idle;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderIdle) {
    Object.assign(this, order);
  }
}
