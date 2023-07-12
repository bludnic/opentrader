import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SmartSellOrderPlaced } from '../types';

export class SmartSellOrderPlacedEntity implements SmartSellOrderPlaced {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Placed;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderPlaced) {
    Object.assign(this, order);
  }
}
