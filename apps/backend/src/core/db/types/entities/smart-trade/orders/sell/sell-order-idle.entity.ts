import { OrderSideEnum, OrderStatusEnum } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { SmartSellOrderIdle } from '../types';

export class SmartSellOrderIdleEntity implements SmartSellOrderIdle {
  exchangeOrderId: string;
  clientOrderId: string;
  price: number;
  fee: number;
  @ApiProperty({
    enum: OrderSideEnum,
  })
  side: OrderSideEnum.Sell;
  @ApiProperty({
    enum: OrderStatusEnum,
  })
  status: OrderStatusEnum.Idle;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderIdle) {
    Object.assign(this, order);
  }
}
