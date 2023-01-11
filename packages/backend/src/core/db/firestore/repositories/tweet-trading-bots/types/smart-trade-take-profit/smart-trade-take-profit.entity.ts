import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, ValidateNested } from 'class-validator';
import { ISmartTradeTakeProfit } from './smart-trade-take-profit.interface';
import { SmartTradeTakeProfitStepDto } from './take-profit-step/smart-trade-take-profit-step.dto';
import { SmartTradeTakeProfitStepEntity } from './take-profit-step/smart-trade-take-profit-step.entity';
import { ISmartTradeTakeProfitStep } from './take-profit-step/smart-trade-take-profit-step.interface';

export class SmartTradeTakeProfitEntity implements ISmartTradeTakeProfit {
  @IsDefined()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    type: () => SmartTradeTakeProfitStepDto,
  })
  @ValidateNested()
  @Type(() => SmartTradeTakeProfitStepEntity)
  steps: ISmartTradeTakeProfitStep[];

  constructor(takeProfit: SmartTradeTakeProfitEntity) {
    Object.assign(this, takeProfit);
  }
}
