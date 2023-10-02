import { $Enums } from '@opentrader/markets-prisma';
import { ExchangeCode } from '@opentrader/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Exchange } from 'src/core/prisma/types/exchange/exchange.type';

export class CreateExchangeRequestDto
  implements Pick<Exchange, 'code' | 'name'>
{
  @ApiProperty({
    enum: ExchangeCode,
  })
  @IsEnum(ExchangeCode)
  code: $Enums.ExchangeCode;

  @ApiProperty()
  @IsString()
  name: string;
}
