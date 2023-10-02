import { $Enums } from '@opentrader/markets-prisma';
import { ExchangeCode } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetMarketsRequestDto {
  @ApiProperty({
    enum: ExchangeCode,
  })
  @IsEnum(ExchangeCode)
  @IsOptional()
  exchangeCode?: $Enums.ExchangeCode;
}
