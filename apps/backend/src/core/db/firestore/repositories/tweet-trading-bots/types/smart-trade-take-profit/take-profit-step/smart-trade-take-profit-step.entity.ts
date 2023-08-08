import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { SmartTradeOrderType } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { SmartTradeTakeProfitStepPriceDto } from './profit-step-price/smart-trade-take-profit-step-price.dto';
import { SmartTradeTakeProfitStepPriceEntity } from './profit-step-price/smart-trade-take-profit-step-price.entity';
import { ISmartTradeTakeProfitStepPrice } from './profit-step-price/smart-trade-take-profit-step-price.interface';
import { ISmartTradeTakeProfitStep } from './smart-trade-take-profit-step.interface';

export class SmartTradeTakeProfitStepEntity
  implements ISmartTradeTakeProfitStep
{
  @ApiProperty({
    enum: SmartTradeOrderType,
    enumName: 'SmartTradeOrderType',
  })
  @IsDefined()
  @IsEnum(SmartTradeOrderType)
  order_type: SmartTradeOrderType;

  @ApiProperty({
    type: () => SmartTradeTakeProfitStepPriceDto,
  })
  @ValidateNested()
  @Type(() => SmartTradeTakeProfitStepPriceEntity)
  @IsDefined()
  price: ISmartTradeTakeProfitStepPrice;

  constructor(step: SmartTradeTakeProfitStepEntity) {
    Object.assign(this, step);
  }
}
