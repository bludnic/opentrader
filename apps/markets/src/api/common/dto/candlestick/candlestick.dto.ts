import { $Enums } from '@bifrost/markets-prisma';
import { ExchangeCode } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { Candlestick } from 'src/core/prisma/types';

export class CandlestickDto implements Candlestick {
  timeframe: string;
  timestamp: Date;
  marketSymbol: string;
  @ApiProperty({
    enum: ExchangeCode,
  })
  marketExchangeCode: $Enums.ExchangeCode;
  open: number;
  high: number;
  low: number;
  close: number;
}
