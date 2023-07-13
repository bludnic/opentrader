import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { SmartTradeOrderSide } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/enums/smart-trade-order-side.enum';
import { SmartTradeOrderType } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { SmartTradePositionPriceDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/smart-trade-position-price/smart-trade-position-price.dto';
import { ISmartTradePositionPrice } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/smart-trade-position-price/smart-trade-position-price.interface';
import { SmartTradePositionUnitsDto } from './position-units/smart-trade-position-units.dto';
import { ISmartTradePositionUnits } from './position-units/smart-trade-position-units.interface';
import { ISmartTradePosition } from './smart-trade-position.interface';

export class SmartTradePositionEntity implements ISmartTradePosition {
  @ApiProperty({
    enum: SmartTradeOrderSide,
    enumName: 'SmartTradeOrderSide',
  })
  @IsDefined()
  @IsEnum(SmartTradeOrderSide)
  type: SmartTradeOrderSide;

  @ApiProperty({
    type: () => SmartTradePositionUnitsDto,
  })
  @ValidateNested()
  @Type(() => SmartTradePositionUnitsDto)
  units: ISmartTradePositionUnits;

  @ApiProperty({
    type: () => SmartTradePositionPriceDto,
  })
  @ValidateNested()
  @Type(() => SmartTradePositionPriceDto)
  price: ISmartTradePositionPrice;

  @ApiProperty({
    enum: SmartTradeOrderType,
    enumName: 'SmartTradeOrderType',
  })
  @IsDefined()
  @IsEnum(SmartTradeOrderType)
  order_type: SmartTradeOrderType;

  constructor(position: SmartTradePositionEntity) {
    Object.assign(this, position);
  }
}
