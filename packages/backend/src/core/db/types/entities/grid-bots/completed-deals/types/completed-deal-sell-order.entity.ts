import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';
import { ICompletedDealSellOrder } from './completed-deal-sell-order.interface';

export class CompletedDealSellOrderEntity implements ICompletedDealSellOrder {
  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty({
    description: 'Fee in Quote Currency',
  })
  feeInQuoteCurrency: number;
}
