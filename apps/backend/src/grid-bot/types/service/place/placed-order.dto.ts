import { OrderStatusEnum } from '@bifrost/types';

export class PlacedOrderDto {
  status: OrderStatusEnum;
  price: number;
}
