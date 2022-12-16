import { BotFirestoreDto } from 'src/core/db/firestore/collections/bots/bot-firestore.dto';

export class GetBotResponseBodyDto {
  bot: BotFirestoreDto;
}
