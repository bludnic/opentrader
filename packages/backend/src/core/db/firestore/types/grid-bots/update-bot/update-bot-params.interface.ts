import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';

export type IUpdateBotParams = Partial<
  Pick<
    IBotFirestore,
    | 'id'
    | 'name'
    | 'highPrice'
    | 'lowPrice'
    | 'gridLevels'
    | 'quantityPerGrid'
    | 'enabled'
    | 'deals'
  >
>;
