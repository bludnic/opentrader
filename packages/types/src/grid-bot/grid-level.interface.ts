import type { OrderStatusEnum } from "../smart-trade";

export interface IGridBotLevel {
  buy: {
    price: number;
    status: OrderStatusEnum;
    quantity: number;
  };
  sell: {
    price: number;
    status: OrderStatusEnum;
    quantity: number;
  };
}
