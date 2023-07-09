import { IGridLine } from './grid-lines/grid-line.interface';
import { InitialInvestment } from './investment/initial-investment.interface';
import { IGridBotSmartTradeRef } from './smart-trades/smart-trade-ref.interface';

export interface IGridBot {
  id: string;
  name: string;
  baseCurrency: string; // e.g 1INCH
  quoteCurrency: string; // e.g USDT
  gridLines: IGridLine[]; // quantity per each grid
  enabled: boolean;
  createdAt: number;
  smartTrades: IGridBotSmartTradeRef[];

  initialInvestment: InitialInvestment;

  userId: string;
  exchangeAccountId: string;
}
