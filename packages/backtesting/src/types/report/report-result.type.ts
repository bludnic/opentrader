import type { ActiveOrder } from "./active-order.type";
import type { Transaction } from "./transaction.type";

export type ReportResult = {
  transactions: Transaction[];
  activeOrders: ActiveOrder[];
  totalProfit: number;
};
