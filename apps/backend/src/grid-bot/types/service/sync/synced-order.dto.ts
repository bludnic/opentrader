import { OrderStatusEnum } from '@bifrost/types';

export class SyncedOrderDto {
  status: OrderStatusEnum;
  price: number;
  current: boolean;
}
