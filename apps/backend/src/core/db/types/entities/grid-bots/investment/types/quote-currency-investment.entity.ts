import { IsDefined, IsNumber } from 'class-validator';
import { IQuoteCurrencyInvestment } from './quote-currency-investment.interface';

export class QuoteCurrencyInvestmentEntity implements IQuoteCurrencyInvestment {
  @IsDefined()
  @IsNumber()
  quantity: number;
}
