import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { SmartSellOrderFilled } from '../types';

export class SmartSellOrderFilledEntity implements SmartSellOrderFilled {
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
  status: OrderStatusEnum.Filled;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderFilled) {
    Object.assign(this, order);
  }
}
