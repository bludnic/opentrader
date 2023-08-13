import { PartialType, PickType } from '@nestjs/swagger';
import { GridBotEntity } from 'src/core/db/types/entities/grid-bots/grid-bot.entity';

export class UpdateGridBotDto extends PartialType(
  PickType(GridBotEntity, ['name', 'gridLines', 'enabled']),
) {}
