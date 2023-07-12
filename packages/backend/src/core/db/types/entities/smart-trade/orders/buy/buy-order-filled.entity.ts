import { OrderSideEnum } from "src/core/db/types/common/enums/order-side.enum";
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";
import { SmartBuyOrderFilled } from "../types";

export class SmartBuyOrderFilledEntity implements SmartBuyOrderFilled {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Filled;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderFilled) {
    Object.assign(this, order);
  }
}
