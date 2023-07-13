import { OmitType } from '@nestjs/swagger';
import { Create3CommasAccountDto } from './create-3commas-account.dto';

export class Update3CommasAccountDto extends OmitType(Create3CommasAccountDto, [
  'id',
] as const) {}
