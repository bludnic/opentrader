import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';

export class StopBotResponseBodyDto {
  botId: IBotFirestore['id'];
  message: string;
}
