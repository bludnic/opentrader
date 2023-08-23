import { OmitType } from '@nestjs/swagger';
import { Exchange } from 'src/core/db/entities/exchange.entity';

export class ExchangeDto extends OmitType(Exchange, ['markets']) {}
