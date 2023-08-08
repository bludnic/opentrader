import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SmartBuyOrderFilledEntity } from './orders/buy/buy-order-filled.entity';
import { SmartBuyOrderIdleEntity } from './orders/buy/buy-order-idle.entity';
import { SmartBuyOrderPlacedEntity } from './orders/buy/buy-order-placed.entity';
import { SmartBuyOrderEntity } from './orders/buy/buy-order.entity';
import { SmartSellOrderFilledEntity } from './orders/sell/sell-order-filled.entity';
import { SmartSellOrderPlacedEntity } from './orders/sell/sell-order-placed.entity';
import { SmartSellOrderEntity } from './orders/sell/sell-order.entity';
import { SmartBuyOrder, SmartSellOrder } from './orders/types';
import { ISmartTrade } from './smart-trade.interface';

@ApiExtraModels(
  SmartBuyOrderIdleEntity,
  SmartBuyOrderPlacedEntity,
  SmartBuyOrderFilledEntity,
  SmartSellOrderPlacedEntity,
  SmartSellOrderFilledEntity,
)
export class SmartTradeEntity implements ISmartTrade {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsString()
  baseCurrency: string; // e.g 1INCH

  @IsNotEmpty()
  @IsString()
  quoteCurrency: string; // e.g USDT

  @ApiProperty({
    type: () => SmartBuyOrderEntity,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => SmartBuyOrderEntity) // @todo DTO
  buyOrder: SmartBuyOrder;

  @ApiProperty({
    type: () => SmartSellOrderEntity,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => SmartSellOrderEntity) // @todo DTO
  sellOrder: SmartSellOrder;

  quantity: number;

  botId: string | null;

  @IsDefined()
  @IsNumber()
  createdAt: number;

  @IsDefined()
  @IsNumber()
  updatedAt: number;

  userId: string;

  @IsDefined()
  @IsString()
  exchangeAccountId: string;

  constructor(smartTrade: SmartTradeEntity) {
    Object.assign(this, smartTrade);
  }
}