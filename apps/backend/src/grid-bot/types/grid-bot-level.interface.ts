import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";

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
