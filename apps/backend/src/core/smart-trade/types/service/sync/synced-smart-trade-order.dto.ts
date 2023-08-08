import { OrderStatusEnum } from '@bifrost/types';

export class SyncedSmartTradeOrderDto {
  status: OrderStatusEnum;
  price: number;
}
