import { OrderSideEnum } from '@bifrost/types';

export interface ITrade {
  smartTradeId: string;
  side: OrderSideEnum;
  price: number;
  quantity: number;
  time: number;
}
