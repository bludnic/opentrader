import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { SmartTradeOrderType } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { SmartTradePositionPriceDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/smart-trade-position-price/smart-trade-position-price.dto';
import { ISmartTradePositionPrice } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/smart-trade-position-price/smart-trade-position-price.interface';
import { ISmartTradeStopLoss } from './smart-trade-stop-loss.interface';

export class SmartTradeStopLossEntity implements ISmartTradeStopLoss {
  @IsDefined()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    enum: SmartTradeOrderType,
    enumName: 'SmartTradeOrderType',
  })
  @IsDefined()
  @IsEnum(SmartTradeOrderType)
  order_type: SmartTradeOrderType;

  @ApiProperty({
    type: () => SmartTradePositionPriceDto,
  })
  @ValidateNested()
  @Type(() => SmartTradePositionPriceDto)
  price: ISmartTradePositionPrice;

  constructor(stopLoss: SmartTradeStopLossEntity) {
    Object.assign(this, stopLoss);
  }
}
