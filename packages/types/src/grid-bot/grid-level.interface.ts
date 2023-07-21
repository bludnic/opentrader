import { OrderStatusEnum } from "src/common/enums";

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
