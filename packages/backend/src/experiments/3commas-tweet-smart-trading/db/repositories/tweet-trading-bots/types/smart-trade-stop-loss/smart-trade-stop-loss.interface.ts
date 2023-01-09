import { SmartTradeOrderType } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { ISmartTradePositionPrice } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/common/smart-trade-position-price/smart-trade-position-price.interface';

export interface ISmartTradeStopLoss {
  enabled: boolean;
  order_type: SmartTradeOrderType;
  price: ISmartTradePositionPrice;
}
