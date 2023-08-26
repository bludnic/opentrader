import { isSmartTrade, SmartTrade } from "@bifrost/bot-processor";
import { OrderStatusEnum } from "@bifrost/types";

import { buyOrder } from "./report/buyOrder";
import { buyTransaction } from "./report/buyTransaction";
import { sellOrder } from "./report/sellOrder";
import { sellTransaction } from "./report/sellTransaction";
import { ActiveOrder, ReportResult, Transaction } from "./types";

export class BacktestingReport {
  constructor(private smartTrades: SmartTrade[]) {}

  create(): ReportResult {
    return {
      transactions: this.getTransactions(),
      activeOrders: this.getActiveOrders(),
      totalProfit: this.calcTotalProfit(),
    };
  }

  getTransactions(): Transaction[] {
    const transactions: Transaction[] = [];

    const finishedSmartTrades = this.getFinishedSmartTrades()

    finishedSmartTrades.forEach((smartTrade) => {
      transactions.push(buyTransaction(smartTrade));
      transactions.push(sellTransaction(smartTrade));
    });

    return transactions;
  }

  getActiveOrders(): ActiveOrder[] {
    const activeOrders: ActiveOrder[] = [];

    const smartTrades = this.getActiveSmartTrades();

    smartTrades.forEach((smartTrade) => {
      activeOrders.push(buyOrder(smartTrade));
      activeOrders.push(sellOrder(smartTrade));
    });

    return activeOrders;
  }

  private calcTotalProfit(): number {
    return this.getSmartTrades().reduce((acc, curr) => {
      const priceDiff =
        curr.buy && curr.sell ? curr.sell.price - curr.buy.price : 0;
      const profit = priceDiff * curr.quantity;

      return acc + profit;
    }, 0);
  }

  private getActiveSmartTrades() {
    return this.getSmartTrades().filter(
      (smartTrade) =>
        smartTrade.buy.status === OrderStatusEnum.Placed ||
        smartTrade.sell.status === OrderStatusEnum.Placed
    );
  }

  private getFinishedSmartTrades() {
    return this.getSmartTrades().filter(smartTrade => {
      return smartTrade.buy.status === OrderStatusEnum.Filled &&
        smartTrade.sell.status === OrderStatusEnum.Filled
    })
  }

  private getSmartTrades() {
    return this.smartTrades.filter(isSmartTrade);
  }
}
