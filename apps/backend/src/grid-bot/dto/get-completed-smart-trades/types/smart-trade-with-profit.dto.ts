import { SmartTradeDto } from 'src/core/db/firestore/repositories/smart-trade/dto/smart-trade.dto';

export class SmartTradeWithProfitDto extends SmartTradeDto {
  /**
   * Doesn't include Exchange fee.
   */
  grossProfit: number;
  /**
   * Profit minus Exchange fee.
   */
  netProfit: number;
}
