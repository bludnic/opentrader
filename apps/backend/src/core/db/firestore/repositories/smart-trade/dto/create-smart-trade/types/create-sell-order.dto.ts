import { OmitType } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatusEnum } from '@bifrost/types';
import { SmartSellOrderEntity } from 'src/core/db/types/entities/smart-trade/orders/sell/sell-order.entity';

export class CreateSmartTradeSellOrderDto extends OmitType(
  SmartSellOrderEntity,
  [
    'exchangeOrderId',
    'clientOrderId',
    'side',
    'quantity',
    'status',
    'fee',
    'createdAt',
    'updatedAt',
  ] as const,
) {
  @IsString()
  @IsOptional()
  clientOrderId?: string;

  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;

  @IsNumber()
  @IsDefined()
  price: number;
}
