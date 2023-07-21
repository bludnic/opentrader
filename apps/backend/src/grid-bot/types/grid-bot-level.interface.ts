import { OrderStatusEnum } from "@bifrost/types";

export interface IGridBotLevel {
  buy: {
    price: number;
    status: OrderStatusEnum;
    quantity: number;
  },
  sell: {
    price: number;
    status: OrderStatusEnum;
    quantity: number;
  }
}
