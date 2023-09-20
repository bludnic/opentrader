import { $Enums } from '@bifrost/markets-prisma';
import { ExchangeCode } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';
import { Exchange } from 'src/core/prisma/types/exchange/exchange.type';

export class CreateExchangeRequestDto
  implements Pick<Exchange, 'code' | 'name'>
{
  @ApiProperty({
    enum: ExchangeCode,
  })
  code: $Enums.ExchangeCode;

  @ApiProperty()
  name: string;
}
