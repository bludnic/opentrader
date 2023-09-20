import { $Enums } from '@bifrost/markets-prisma';
import { ExchangeCode } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { MarketDto } from 'src/api/common/dto/market';
import { ExchangeWithMarkets } from 'src/core/prisma/types';

export class ExchangeFullDto implements ExchangeWithMarkets {
  @ApiProperty({
    enum: ExchangeCode,
  })
  code: $Enums.ExchangeCode;
  name: string;
  markets: MarketDto[];
}
