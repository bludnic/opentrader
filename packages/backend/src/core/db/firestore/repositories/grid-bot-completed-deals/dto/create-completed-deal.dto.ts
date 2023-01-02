import { OmitType } from '@nestjs/swagger';
import { CompletedDealEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.entity';

export class CreateCompletedDealDto extends OmitType(CompletedDealEntity, [
  'id',
  'createdAt',
  'botId',
] as const) {}
