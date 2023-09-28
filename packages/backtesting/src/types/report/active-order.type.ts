import { OrderSideEnum } from "@bifrost/types";

export type ActiveOrder = {
  side: OrderSideEnum;
  quantity: number;
  price: number;
};
