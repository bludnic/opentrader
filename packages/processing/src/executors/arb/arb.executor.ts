import { xprisma } from "@opentrader/db";
import type { SmartTradeWithOrders } from "@opentrader/db";
import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { ISmartTradeExecutor } from "../smart-trade-executor.interface.js";
import { OrderExecutor } from "../order/order.executor.js";

export class ArbExecutor implements ISmartTradeExecutor {
  smartTrade: SmartTradeWithOrders;

  constructor(smartTrade: SmartTradeWithOrders) {
    this.smartTrade = smartTrade;
  }

  static create(smartTrade: SmartTradeWithOrders) {
    return new ArbExecutor(smartTrade);
  }

  static async fromId(id: number) {
    const smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });

    return new ArbExecutor(smartTrade);
  }

  static async fromOrderId(orderId: number) {
    const order = await xprisma.order.findUniqueOrThrow({
      where: {
        id: orderId,
      },
      include: {
        smartTrade: {
          include: {
            orders: true,
            exchangeAccount: true,
          },
        },
      },
    });

    return new ArbExecutor(order.smartTrade);
  }

  static async fromExchangeOrderId(exchangeOrderId: string) {
    const order = await xprisma.order.findFirstOrThrow({
      where: {
        exchangeOrderId,
      },
      include: {
        smartTrade: {
          include: {
            orders: true,
            exchangeAccount: true,
          },
        },
      },
    });

    return new ArbExecutor(order.smartTrade);
  }

  /**
   * Place both entry and take profit orders at the same time.
   */
  async next(): Promise<boolean> {
    const entryOrder = this.smartTrade.orders.find((order) => order.entityType === "EntryOrder")!;
    const takeProfitOrder = this.smartTrade.orders.find((order) => order.entityType === "TakeProfitOrder")!;

    const exchangeAccount1 = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: { id: entryOrder.exchangeAccountId },
    });
    const exchangeAccount2 = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: { id: takeProfitOrder.exchangeAccountId },
    });
    const exchange1 = exchangeProvider.fromAccount(exchangeAccount1);
    const exchange2 = exchangeProvider.fromAccount(exchangeAccount2);

    const entryOrderExecutor = new OrderExecutor(entryOrder, exchange1, entryOrder.symbol);
    const tpOrderExecutor = new OrderExecutor(takeProfitOrder, exchange2, takeProfitOrder.symbol);

    if (entryOrder.status === "Idle" && takeProfitOrder.status === "Idle") {
      await Promise.all([entryOrderExecutor.place(), tpOrderExecutor.place()]);
      await this.pull();

      logger.info(`[ArbExecutor] Orders placed. SmartTrade { id: ${this.smartTrade.id} }`);

      return true;
    }

    logger.info(
      `[ArbExecutor] Nothing to do: Position { id: ${this.smartTrade.id}, entryOrderStatus: ${entryOrder.status}, takeProfitOrderStatus: ${takeProfitOrder.status} }`,
    );
    return false;
  }

  /**
   * Cancel all orders linked to the smart trade.
   * Return number of cancelled orders.
   */
  async cancelOrders(): Promise<number> {
    const allOrders = [];

    for (const order of this.smartTrade.orders) {
      const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
        where: { id: order.exchangeAccountId },
      });
      const exchange = exchangeProvider.fromAccount(exchangeAccount);

      const orderExecutor = new OrderExecutor(order, exchange, order.symbol);

      const cancelled = await orderExecutor.cancel();
      allOrders.push(cancelled);
    }

    await this.pull();

    const cancelledOrders = allOrders.filter((cancelled) => cancelled);
    logger.info(
      `[ArbExecutor] Orders were canceled: Position { id: ${this.smartTrade.id} }. Cancelled ${cancelledOrders.length} of ${allOrders.length} orders.`,
    );

    return cancelledOrders.length;
  }

  get status(): "Entering" | "Exiting" | "Finished" {
    const entryOrder = this.smartTrade.orders.find((order) => order.entityType === "EntryOrder")!;
    const takeProfitOrder = this.smartTrade.orders.find((order) => order.entityType === "TakeProfitOrder");

    if (entryOrder.status === "Idle" || entryOrder.status === "Placed") {
      return "Entering";
    }

    if (
      entryOrder.status === "Filled" &&
      (takeProfitOrder?.status === "Idle" || takeProfitOrder?.status === "Placed")
    ) {
      return "Exiting";
    }

    return "Finished";
  }

  /**
   * Pulls the order from the database to update the status.
   * Call directly only for testing.
   */
  async pull() {
    this.smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
      where: {
        id: this.smartTrade.id,
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });
  }
}
