import type { OrderStatusEnum } from "../smart-trade/enums.js";

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
