import { GridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/grid-bot.dto';

export class StartBotResponseBodyDto {
  bot: GridBotDto;
  currentAssetPrice: number;
}
