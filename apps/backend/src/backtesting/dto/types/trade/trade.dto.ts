import { OrderSideEnum } from '@bifrost/types';
import { SmartTradeDto } from 'src/core/db/firestore/repositories/smart-trade/dto/smart-trade.dto';
import { IBacktestingTrade } from './trade.interface';

export class BacktestingTradeDto implements IBacktestingTrade {
  smartTrade: SmartTradeDto;
  side: OrderSideEnum;
  price: number;
  quantity: number;
  time: number;
}
