import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { SmartSellOrderPlaced } from '../types';

export class SmartSellOrderPlacedEntity implements SmartSellOrderPlaced {
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
  status: OrderStatusEnum.Placed;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartSellOrderPlaced) {
    Object.assign(this, order);
  }
}
