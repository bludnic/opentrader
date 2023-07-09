import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SmartSellOrderFilled } from '../types';

export class SmartSellOrderFilledEntity implements SmartSellOrderFilled {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  side: OrderSideEnum.Sell;
  status: OrderStatusEnum.Filled;
  quantity: number;
  createdAt: number;

  constructor(order: SmartSellOrderFilled) {
    Object.assign(this, order);
  }
}
