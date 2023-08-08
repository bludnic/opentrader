import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { ISmartTradePositionUnits } from './smart-trade-position-units.interface';

export class SmartTradePositionUnitsEntity implements ISmartTradePositionUnits {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  value: string;

  constructor(units: ISmartTradePositionUnits) {
    Object.assign(this, units);
  }
}
