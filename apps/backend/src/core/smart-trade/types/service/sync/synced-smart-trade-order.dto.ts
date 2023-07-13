import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';

export class SyncedSmartTradeOrderDto {
  status: OrderStatusEnum;
  price: number;
}
