import { $Enums } from '@opentrader/markets-prisma';
import { ExchangeCode } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { Market } from 'src/core/prisma/types';

export class MarketDto implements Market {
  symbol: string;
  @ApiProperty({
    enum: ExchangeCode,
  })
  exchangeCode: $Enums.ExchangeCode;
  updatedAt: Date;
}
