import { OrderStatusEnum } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export class SyncedOrderDto {
  status: OrderStatusEnum;
  price: number;
  current: boolean;
}
