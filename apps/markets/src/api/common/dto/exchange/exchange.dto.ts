import { ExchangeCode } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@bifrost/markets-prisma';
import { Exchange } from 'src/core/prisma/types/exchange/exchange.type';

export class ExchangeDto implements Exchange {
  @ApiProperty({
    enum: ExchangeCode,
  })
  code: $Enums.ExchangeCode;
  name: string;
}
