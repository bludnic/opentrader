import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';

export class SyncedOrderDto {
  status: OrderStatusEnum;
  price: number;
  current: boolean;
}
