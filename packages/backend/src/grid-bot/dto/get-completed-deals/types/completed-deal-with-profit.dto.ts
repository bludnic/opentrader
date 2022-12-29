import { CompletedDealDto } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/dto/completed-deal.dto';

export class CompletedDealWithProfitDto extends CompletedDealDto {
  /**
   * Doesn't include Exchange fee.
   */
  grossProfit: number;
  /**
   * Profit minus Exchange fee.
   */
  netProfit: number;
}
