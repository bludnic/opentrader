import { ActiveOrder } from "@bifrost/backtesting";
import { OrderSideEnum } from "@bifrost/types";

export class ActiveOrderDto implements ActiveOrder {
  side: OrderSideEnum;
  quantity: number;
  price: number;
}
