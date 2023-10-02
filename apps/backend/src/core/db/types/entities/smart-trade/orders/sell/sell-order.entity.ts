import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderSideEnum, OrderStatusEnum } from '@opentrader/types';
import {
  BaseSmartOrder,
  SmartSellOrder,
  SmartSellOrderFilled,
  SmartSellOrderIdle,
  SmartSellOrderPlaced,
} from '../types';
import { SmartSellOrderFilledEntity } from './sell-order-filled.entity';
import { SmartSellOrderIdleEntity } from './sell-order-idle.entity';
import { SmartSellOrderPlacedEntity } from './sell-order-placed.entity';

export class SmartSellOrderEntity<T = SmartSellOrder>
  implements BaseSmartOrder<OrderSideEnum.Sell, OrderStatusEnum>
{
  @IsString()
  exchangeOrderId: string;

  @IsString()
  clientOrderId: string;

  @ApiProperty({
    enum: OrderSideEnum,
  })
  @Equals(OrderSideEnum.Sell)
  side: OrderSideEnum.Sell;

  @IsDefined()
  @IsNumber()
  quantity: number;

  @IsDefined()
  @IsNumber()
  price: number;

  @ApiProperty({
    enum: OrderStatusEnum,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsDefined()
  @IsNumber()
  fee: number;

  createdAt: number;
  updatedAt: number;

  constructor(smartSellOrder: SmartSellOrderEntity) {
    Object.assign(this, smartSellOrder);
  }

  static from(order: SmartSellOrder) {
    switch (order.status) {
      case OrderStatusEnum.Idle:
        return new SmartSellOrderIdleEntity(order);
      case OrderStatusEnum.Placed:
        return new SmartSellOrderPlacedEntity(order);
      case OrderStatusEnum.Filled:
        return new SmartSellOrderFilledEntity(order);
    }
  }

  static sellIdle(order: SmartSellOrderIdle): SmartSellOrderIdleEntity {
    return new SmartSellOrderIdleEntity(order);
  }

  static sellPlaced(order: SmartSellOrderPlaced): SmartSellOrderPlacedEntity {
    return new SmartSellOrderPlacedEntity(order);
  }

  static sellFilled(order: SmartSellOrderFilled): SmartSellOrderFilledEntity {
    return new SmartSellOrderFilledEntity(order);
  }
}
