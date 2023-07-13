import { SmartTradeProfitStepPriceType } from './enums/smart-trade-profit-step-price-type.enum';

export interface ISmartTradeTakeProfitStepPrice {
  value: string;
  type: SmartTradeProfitStepPriceType;
  volume: string;
}
