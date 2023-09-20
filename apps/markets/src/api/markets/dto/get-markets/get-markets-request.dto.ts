import { $Enums } from '@bifrost/markets-prisma';
import { ExchangeCode } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';

export class GetMarketsRequestDto {
  @ApiProperty({
    enum: ExchangeCode,
  })
  exchangeCode?: $Enums.ExchangeCode;
}
