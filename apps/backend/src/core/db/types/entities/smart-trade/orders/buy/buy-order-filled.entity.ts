import { OrderSideEnum, OrderStatusEnum } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { SmartBuyOrderFilled } from '../types';

export class SmartBuyOrderFilledEntity implements SmartBuyOrderFilled {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  @ApiProperty({
    enum: OrderSideEnum,
  })
  side: OrderSideEnum.Buy;
  @ApiProperty({
    enum: OrderStatusEnum,
  })
  status: OrderStatusEnum.Filled;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderFilled) {
    Object.assign(this, order);
  }
}
