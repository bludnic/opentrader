import { BarSize, ExchangeCode } from '@opentrader/types';
import { $Enums } from '@opentrader/markets-prisma';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateTimeframeRequestDto {
  @IsEnum(BarSize)
  timeframe: BarSize;

  @ApiProperty({
    enum: ExchangeCode,
  })
  @IsEnum(ExchangeCode)
  exchangeCode: $Enums.ExchangeCode;

  @IsString()
  symbol: string;
}
