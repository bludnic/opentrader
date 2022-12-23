import { OmitType } from '@nestjs/swagger';
import { GridBotEntity } from 'src/core/db/types/entities/grid-bots/grid-bot.entity';

export class CreateGridBotDto extends OmitType(GridBotEntity, [
  'enabled',
  'createdAt',
  'deals',
  'userId',
] as const) {}
