import type { ActiveOrder } from "#backtesting/types/report/active-order.type";
import type { Transaction } from "#backtesting/types/report/transaction.type";

export type ReportResult = {
  transactions: Transaction[];
  activeOrders: ActiveOrder[];
  totalProfit: number;
};
