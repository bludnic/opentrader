import { IsDefined, IsNumber } from 'class-validator';
import { ICompletedDealSellOrder } from './completed-deal-sell-order.interface';

export class CompletedDealSellOrderEntity implements ICompletedDealSellOrder {
  @IsDefined()
  @IsNumber()
  price: number;
}
