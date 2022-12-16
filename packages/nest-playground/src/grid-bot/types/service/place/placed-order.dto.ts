import { OrderStatusEnum } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export class PlacedOrderDto {
  status: OrderStatusEnum;
  price: number;
}
