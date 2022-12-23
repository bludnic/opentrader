import { OmitType } from '@nestjs/swagger';
import { GridBotEventEntity } from 'src/core/db/types/entities/grid-bots/events/grid-bot-event.entity';

export class CreateGridBotEventDto extends OmitType(GridBotEventEntity, [
  'botId',
  'createdAt',
] as const) {}
