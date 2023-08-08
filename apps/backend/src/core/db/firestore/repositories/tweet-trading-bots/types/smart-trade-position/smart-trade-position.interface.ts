import { SmartTradeOrderSide } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/enums/smart-trade-order-side.enum';
import { SmartTradeOrderType } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { ISmartTradePositionPrice } from 'src/core/db/firestore/repositories/tweet-trading-bots/common/smart-trade-position-price/smart-trade-position-price.interface';
import { ISmartTradePositionUnits } from './position-units/smart-trade-position-units.interface';

export interface ISmartTradePosition {
  type: SmartTradeOrderSide;
  units: ISmartTradePositionUnits;
  price: ISmartTradePositionPrice;
  order_type: SmartTradeOrderType;
}
