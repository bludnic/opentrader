import { DealStatusEnum, OrderStatusEnum } from '@bifrost/types';

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
