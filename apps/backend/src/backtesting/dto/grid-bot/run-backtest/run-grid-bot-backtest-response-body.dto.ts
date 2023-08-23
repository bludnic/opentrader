import { ActiveOrder, ReportResult, Transaction } from '@bifrost/backtesting';

export class RunGridBotBacktestResponseBodyDto implements ReportResult {
  // @todo dtos
  transactions: Transaction[];
  activeOrders: ActiveOrder[];
  totalProfit: number;
}
