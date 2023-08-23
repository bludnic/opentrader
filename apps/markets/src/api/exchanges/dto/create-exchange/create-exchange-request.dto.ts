import { PickType } from '@nestjs/swagger';
import { Exchange } from 'src/core/db/entities/exchange.entity';

export class CreateExchangeRequestDto extends PickType(Exchange, [
  'code',
  'name',
]) {}
