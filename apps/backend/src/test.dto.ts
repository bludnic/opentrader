import { OrderStatusEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';

export class TestDto {
  @ApiProperty({
    enum: OrderStatusEnum,
    enumName: 'OrderStatus',
  })
  code: OrderStatusEnum;
}
