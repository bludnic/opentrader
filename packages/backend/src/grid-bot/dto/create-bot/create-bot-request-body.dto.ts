import { OmitType } from '@nestjs/swagger';
import { CreateGridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/create-grid-bot.dto';

export class CreateBotRequestBodyDto extends OmitType(CreateGridBotDto, [
  'initialInvestment',
] as const) {}
