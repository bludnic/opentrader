import { $Enums } from '@opentrader/markets-prisma';
import { ExchangeCode } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { MarketTimeframe } from 'src/core/prisma/types';

export class CreateTimeframeResponseDto implements MarketTimeframe {
  timeframe: string;
  marketSymbol: string;
  @ApiProperty({
    enum: ExchangeCode,
  })
  marketExchangeCode: $Enums.ExchangeCode;
  historyEndReached: boolean;
}
