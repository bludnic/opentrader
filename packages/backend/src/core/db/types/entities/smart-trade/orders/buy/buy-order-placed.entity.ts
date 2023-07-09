import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";
import { SmartBuyOrderPlaced } from "../types";

export class SmartBuyOrderPlacedEntity implements SmartBuyOrderPlaced {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Buy;
  status: OrderStatusEnum.Placed;
  quantity: number;
  createdAt: number;

  constructor(order: SmartBuyOrderPlaced) {
    Object.assign(this, order);
  }
}
