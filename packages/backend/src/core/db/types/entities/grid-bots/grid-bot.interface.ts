import { IDeal } from './deals/types';
import { IGridLine } from './grid-lines/grid-line.interface';
import { InitialInvestment } from './investment/initial-investment.interface';

export interface IGridBot {
  id: string;
  name: string;
  baseCurrency: string; // e.g 1INCH
  quoteCurrency: string; // e.g USDT
  gridLines: IGridLine[]; // quantity per each grid
  enabled: boolean;
  createdAt: number;
  deals: IDeal[];

  initialInvestment: InitialInvestment;

  userId: string;
  exchangeAccountId: string;
}
