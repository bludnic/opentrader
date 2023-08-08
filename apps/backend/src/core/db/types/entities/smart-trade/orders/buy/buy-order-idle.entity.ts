import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { SmartBuyOrderIdle } from '../types';

export class SmartBuyOrderIdleEntity implements SmartBuyOrderIdle {
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
  status: OrderStatusEnum.Idle;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderIdle) {
    Object.assign(this, order);
  }
}
