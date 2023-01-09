import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { ISmartTradePositionPrice } from './smart-trade-position-price.interface';

export class SmartTradePositionPriceEntity implements ISmartTradePositionPrice {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  value: string;

  constructor(price: ISmartTradePositionPrice) {
    Object.assign(this, price);
  }
}
