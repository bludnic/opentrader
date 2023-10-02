import { OrderSideEnum } from "@opentrader/types";

export type ActiveOrder = {
  side: OrderSideEnum;
  quantity: number;
  price: number;
};
