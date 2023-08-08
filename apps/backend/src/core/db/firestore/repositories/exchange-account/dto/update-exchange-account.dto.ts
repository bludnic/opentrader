import { OmitType } from '@nestjs/swagger';
import { CreateExchangeAccountDto } from './create-exchange-account.dto';

export class UpdateExchangeAccountDto extends OmitType(
  CreateExchangeAccountDto,
  ['id'] as const,
) {}
