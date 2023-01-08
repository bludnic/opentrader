import { IsDefined, IsNumber } from 'class-validator';
import { IBaseCurrencyInvestment } from './base-currency-investment.interface';

export class BaseCurrencyInvestmentEntity implements IBaseCurrencyInvestment {
  @IsDefined()
  @IsNumber()
  quantity: number;

  @IsDefined()
  @IsNumber()
  price: number;
}
