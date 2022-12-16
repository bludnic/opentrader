import { IDeal } from './types/deal-firestore.interface';

export interface IBotFirestore {
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
}
