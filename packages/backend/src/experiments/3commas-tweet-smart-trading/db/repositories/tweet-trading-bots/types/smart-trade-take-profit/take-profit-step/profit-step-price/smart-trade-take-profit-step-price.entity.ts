import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { ISmartTradeTakeProfitStepPrice } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/types/smart-trade-take-profit/take-profit-step/profit-step-price/smart-trade-take-profit-step-price.interface';
import { SmartTradeProfitStepPriceType } from './enums/smart-trade-profit-step-price-type.enum';

export class SmartTradeTakeProfitStepPriceEntity
  implements ISmartTradeTakeProfitStepPrice
{
  @IsNotEmpty()
  @IsNumberString()
  value: string;

  @ApiProperty({
    enum: SmartTradeProfitStepPriceType,
    enumName: 'SmartTradeProfitStepPriceType',
  })
  @IsDefined()
  @IsEnum(SmartTradeProfitStepPriceType)
  type: SmartTradeProfitStepPriceType;

  @IsNotEmpty()
  @IsNumberString()
  volume: string;
}
