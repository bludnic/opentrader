import { ActiveOrder } from "src/types/report/active-order.type";
import { Transaction } from "src/types/report/transaction.type";

export type ReportResult = {
  transactions: Transaction[];
  activeOrders: ActiveOrder[];
  totalProfit: number;
};
