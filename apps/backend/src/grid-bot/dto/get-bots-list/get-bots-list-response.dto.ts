import { GridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/grid-bot.dto';

export class GetBotsListResponseDto {
  bots: GridBotDto[];
}
