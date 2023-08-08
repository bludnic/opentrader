import { ISmartTradeTakeProfitStep } from './take-profit-step/smart-trade-take-profit-step.interface';

export interface ISmartTradeTakeProfit {
  enabled: boolean;
  steps: ISmartTradeTakeProfitStep[];
}
