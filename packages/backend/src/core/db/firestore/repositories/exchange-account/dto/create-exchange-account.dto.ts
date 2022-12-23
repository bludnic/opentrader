import { OmitType } from '@nestjs/swagger';
import { ExchangeAccountEntity } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.entity';

export class CreateExchangeAccountDto extends OmitType(ExchangeAccountEntity, [
  'userId',
  'createdAt',
] as const) {}
