import { ActiveOrder } from "#backtesting/types/report/active-order.type";
import { Transaction } from "#backtesting/types/report/transaction.type";

export type ReportResult = {
  transactions: Transaction[];
  activeOrders: ActiveOrder[];
  totalProfit: number;
};
