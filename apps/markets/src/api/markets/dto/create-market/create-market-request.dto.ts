import { ExchangeCode } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@bifrost/markets-prisma';
import { Market } from 'src/core/prisma/types';

export class CreateMarketRequestDto implements Omit<Market, 'updatedAt'> {
  symbol: string;
  @ApiProperty({
    enum: ExchangeCode,
  })
  exchangeCode: $Enums.ExchangeCode;
}
