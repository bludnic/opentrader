import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';

export interface IGridBot {
  id: string;
  name: string;
  account: string; // reference
  baseCurrency: string; // e.g 1INCH
  quoteCurrency: string; // e.g USDT
  highPrice: number;
  lowPrice: number;
  gridLevels: number;
  quantityPerGrid: number;
  enabled: boolean;
  createdAt: number;
  deals: IDeal[];

  userId: string;
}
