import { ExchangeCode } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@opentrader/markets-prisma';
import { IsEnum, IsString } from 'class-validator';
import { Market } from 'src/core/prisma/types';

export class CreateMarketRequestDto implements Omit<Market, 'updatedAt'> {
  @IsString()
  symbol: string;

  @ApiProperty({
    enum: ExchangeCode,
  })
  @IsEnum(ExchangeCode)
  exchangeCode: $Enums.ExchangeCode;
}
