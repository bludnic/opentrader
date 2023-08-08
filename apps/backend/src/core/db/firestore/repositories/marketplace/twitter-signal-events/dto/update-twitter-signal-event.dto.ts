import { OmitType } from '@nestjs/swagger';
import { TwitterSignalEventEntity } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/twitter-signal-event.entity';

export class UpdateTwitterSignalEventDto extends OmitType(
  TwitterSignalEventEntity,
  ['parsedAt'] as const,
) {}
