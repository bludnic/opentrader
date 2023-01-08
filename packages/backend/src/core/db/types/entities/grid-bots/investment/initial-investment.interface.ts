import { IBaseCurrencyInvestment } from './types/base-currency-investment.interface';
import { IQuoteCurrencyInvestment } from './types/quote-currency-investment.interface';

export interface InitialInvestment {
  baseCurrency: IBaseCurrencyInvestment;
  quoteCurrency: IQuoteCurrencyInvestment;
}
