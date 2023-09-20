import { BarSize, ExchangeCode } from '@bifrost/types';
import { $Enums } from '@bifrost/markets-prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimeframeRequestDto {
  timeframe: BarSize;
  @ApiProperty({
    enum: ExchangeCode,
  })
  exchangeCode: $Enums.ExchangeCode;
  symbol: string;
}
