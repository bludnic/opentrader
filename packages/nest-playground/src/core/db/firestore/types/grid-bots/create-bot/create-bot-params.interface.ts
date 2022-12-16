import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';

export type ICreateBotParams = Pick<
  IBotFirestore,
  | 'id'
  | 'name'
  | 'account'
  | 'baseCurrency'
  | 'quoteCurrency'
  | 'highPrice'
  | 'lowPrice'
  | 'gridLevels'
  | 'quantityPerGrid'
  | 'enabled'
>;
