import { ApiProperty } from '@nestjs/swagger';
import { ExchangeCode } from '@bifrost/types';

export class TestDto {
  @ApiProperty({
    enum: ExchangeCode,
    enumName: 'ExchangeCode',
  })
  prop: ExchangeCode;
}
