import { OrderSideEnum } from '@bifrost/types';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';

export interface IBacktestingTrade {
  smartTrade: ISmartTrade;
  side: OrderSideEnum;
  price: number;
  quantity: number;
  time: number;
}
