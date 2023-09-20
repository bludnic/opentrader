import { $Enums } from '@bifrost/markets-prisma';
import { ExchangeCode } from '@bifrost/types';
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
