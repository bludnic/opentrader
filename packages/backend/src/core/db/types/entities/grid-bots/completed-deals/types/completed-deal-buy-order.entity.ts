import { IsDefined, IsNumber } from 'class-validator';
import { ICompletedDealBuyOrder } from './completed-deal-buy-order.interface';

export class CompletedDealBuyOrderEntity implements ICompletedDealBuyOrder {
  @IsDefined()
  @IsNumber()
  price: number;
}
