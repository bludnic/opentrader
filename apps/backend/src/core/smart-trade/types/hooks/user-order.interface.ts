import { OrderSideEnum } from '@bifrost/types';

export interface UseOrderParams {
  side: OrderSideEnum;
  quantity: number;
  symbol: string;
  price: number;
}
