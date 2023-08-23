import { OmitType } from '@nestjs/swagger';
import { MarketDto } from 'src/core/db/entities/dto/market';
import { Exchange } from 'src/core/db/entities/exchange.entity';

export class ExchangeFullDto extends OmitType(Exchange, ['markets']) {
  markets: MarketDto[];
}
