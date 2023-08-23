import { OmitType } from '@nestjs/swagger';

import { Candlestick } from 'src/core/db/entities/candlestick.entity';

export class CandlestickDto extends OmitType(Candlestick, [
  'market',
  'marketSymbol',
  'marketExchangeCode',
  'timeframe',
]) {}
