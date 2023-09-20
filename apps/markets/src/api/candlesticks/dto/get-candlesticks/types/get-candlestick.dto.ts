import { Candlestick } from 'src/core/prisma/types';

export class GetCandlestickDto
  implements
    Omit<
      Candlestick,
      'timestamp' | 'marketSymbol' | 'marketExchangeCode' | 'timeframe'
    >
{
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}
