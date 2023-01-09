import { OmitType } from '@nestjs/swagger';
import { ThreeCommasAccountEntity } from 'src/core/db/types/entities/3commas-accounts/account/3commas-account.entity';

export class Create3CommasAccountDto extends OmitType(
  ThreeCommasAccountEntity,
  ['userId', 'createdAt'] as const,
) {}
