import { OmitType } from '@nestjs/swagger';
import { TwitterSignalEntity } from 'src/core/db/types/entities/marketplace/twitter-signals/twitter-signal.entity';

export class UpdateTwitterSignalDto extends OmitType(TwitterSignalEntity, [
  'createdAt',
] as const) {}
