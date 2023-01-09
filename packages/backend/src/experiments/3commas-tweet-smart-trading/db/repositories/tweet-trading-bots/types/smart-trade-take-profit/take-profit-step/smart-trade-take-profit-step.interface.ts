import { SmartTradeOrderType } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { ISmartTradeTakeProfitStepPrice } from './profit-step-price/smart-trade-take-profit-step-price.interface';

export interface ISmartTradeTakeProfitStep {
  order_type: SmartTradeOrderType;
  price: ISmartTradeTakeProfitStepPrice;
}
