import { table } from "table";
import type { BotTemplate, IBotConfiguration, Order, SmartTrade } from "@opentrader/bot-processor";
import { ICandlestick, OrderStatusEnum } from "@opentrader/types";
import { format } from "@opentrader/logger";
import { decomposeSymbol } from "@opentrader/tools";
import { buyOrder } from "./report/buyOrder.js";
import { buyTransaction } from "./report/buyTransaction.js";
import { sellOrder } from "./report/sellOrder.js";
import { sellTransaction } from "./report/sellTransaction.js";
import type { ActiveOrder, Transaction } from "./types/index.js";

type OrderInfo = Order & {
  side: "buy" | "sell";
  trade: SmartTrade;
};

export class BacktestingReport {
  constructor(
    private candlesticks: ICandlestick[],
    private smartTrades: SmartTrade[],
    private botConfig: IBotConfiguration,
    private template: BotTemplate<any>,
  ) {}

  create(): string {
    const startDate = format.datetime(this.candlesticks[0]!.timestamp);
    const endDate = format.datetime(this.candlesticks[this.candlesticks.length - 1]!.timestamp);

    const strategyParams = JSON.stringify(this.botConfig.settings, null, 2);
    const strategyName = this.template.name;

    const exchange = this.botConfig.exchangeCode;
    const symbol = this.botConfig.symbol;
    const { baseCurrency, quoteCurrency } = decomposeSymbol(symbol);

    const backtestData: Array<any[]> = [["Date", "Action", "Price", "Quantity", "Amount", "Profit"]];

    const trades = this.getOrders().map((order) => {
      const amount = order.filledPrice! * order.trade.quantity;
      const profit =
        order.side === "sell" && order.trade.sell
          ? (order.trade.sell.filledPrice! - order.trade.buy.filledPrice!) * order.trade.quantity
          : "-";

      return [
        format.datetime(order.updatedAt),
        order.side.toUpperCase(),
        order.filledPrice,
        order.trade.quantity,
        amount,
        profit,
      ];
    });
    const tradesTable = table(backtestData.concat(trades));
    const totalProfit = this.calcTotalProfit();

    return `Backtesting done.

+------------------------+
|   Backtesting Report   |
+------------------------+

Strategy: ${strategyName}
Strategy params:
${strategyParams}

Exchange: ${exchange}
Pair: ${symbol}

Start date: ${startDate}
End date: ${endDate}

Trades:
${tradesTable}

Total Trades: ${this.smartTrades.length}
Total Profit: ${totalProfit} ${quoteCurrency}
    `;
  }

  getOrders(): Array<OrderInfo> {
    const orders: Array<OrderInfo> = [];

    for (const trade of this.getFinishedSmartTrades()) {
      orders.push({
        ...trade.buy,
        side: "buy",
        trade,
      });

      if (trade.sell) {
        orders.push({
          ...trade.sell,
          side: "sell",
          trade,
        });
      }
    }

    return orders.sort((a, b) => a.updatedAt - b.updatedAt);
  }

  getTransactions(): Transaction[] {
    const transactions: Transaction[] = [];

    const finishedSmartTrades = this.getFinishedSmartTrades();

    finishedSmartTrades.forEach((smartTrade) => {
      transactions.push(buyTransaction(smartTrade));

      if (smartTrade.sell) {
        transactions.push(sellTransaction(smartTrade));
      }
    });

    return transactions;
  }

  getActiveOrders(): ActiveOrder[] {
    const activeOrders: ActiveOrder[] = [];

    const smartTrades = this.getActiveSmartTrades();

    smartTrades.forEach((smartTrade) => {
      activeOrders.push(buyOrder(smartTrade));

      if (smartTrade.sell) {
        activeOrders.push(sellOrder(smartTrade));
      }
    });

    return activeOrders;
  }

  private calcTotalProfit(): number {
    return this.smartTrades.reduce((acc, curr) => {
      const priceDiff =
        curr.buy.filledPrice && curr.sell?.filledPrice ? curr.sell.filledPrice - curr.buy.filledPrice : 0;
      const profit = priceDiff * curr.quantity;

      return acc + profit;
    }, 0);
  }

  private getActiveSmartTrades() {
    return this.smartTrades.filter(
      (smartTrade) =>
        smartTrade.buy.status === OrderStatusEnum.Placed || smartTrade.sell?.status === OrderStatusEnum.Placed,
    );
  }

  private getFinishedSmartTrades() {
    return this.smartTrades.filter((smartTrade) => {
      return smartTrade.buy.status === OrderStatusEnum.Filled && smartTrade.sell?.status === OrderStatusEnum.Filled;
    });
  }
}
