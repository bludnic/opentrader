import { DealStatusEnum, OrderStatusEnum } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export type GridBotE2EDeal = {
  id: string;
  status: DealStatusEnum;
  buy: {
    price: number;
    status: OrderStatusEnum;
  };
  sell: {
    price: number;
    status: OrderStatusEnum;
  };
};
