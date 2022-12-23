import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';

export class PlacedOrderDto {
  status: OrderStatusEnum;
  price: number;
}
