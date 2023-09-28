import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { SmartBuyOrderPlaced } from '../types';

export class SmartBuyOrderPlacedEntity implements SmartBuyOrderPlaced {
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
  status: OrderStatusEnum.Placed;
  quantity: number;
  createdAt: number;
  updatedAt: number;

  constructor(order: SmartBuyOrderPlaced) {
    Object.assign(this, order);
  }
}
