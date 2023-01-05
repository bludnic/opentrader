import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';

export interface IGridBot {
  id: string;
  name: string;
  baseCurrency: string; // e.g 1INCH
  quoteCurrency: string; // e.g USDT
  gridLines: IGridLine[]; // quantity per each grid
  enabled: boolean;
  createdAt: number;
  deals: IDeal[];

  userId: string;
  exchangeAccountId: string;
}
