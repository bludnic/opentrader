import { IBotFirestore } from './bot-firestore.interface';
import { IDeal } from './types/deal-firestore.interface';

export class BotFirestoreDto implements IBotFirestore {
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
