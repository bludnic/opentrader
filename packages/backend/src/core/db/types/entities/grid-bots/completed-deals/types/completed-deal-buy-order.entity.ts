import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';
import { ICompletedDealBuyOrder } from './completed-deal-buy-order.interface';

export class CompletedDealBuyOrderEntity implements ICompletedDealBuyOrder {
  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty({
    description: 'Fee in Base Currency',
  })
  feeInBaseCurrency: number;
}
