import { exchangeProvider, IExchange } from "@opentrader/exchanges";
import {
  ExchangeAccountWithCredentials,
  OrderWithSmartTrade,
  xprisma,
} from "@opentrader/db";
import type { IClosedOrder } from "@opentrader/types";

type SyncBySymbolResponse = {
  /**
   * If any order belonging to the bot was filled/canceled
   * the botId will be pushed to that array.
   */
  affectedBotsIds: number[];
};

export class OrdersSynchronizer {
  private exchangeAccount: ExchangeAccountWithCredentials;
  private exchange: IExchange;

  constructor(exchangeAccount: ExchangeAccountWithCredentials) {
    this.exchangeAccount = exchangeAccount;
    this.exchange = exchangeProvider.fromAccount(exchangeAccount);
  }

  async syncBySymbol(symbol: string): Promise<SyncBySymbolResponse> {
    const closedOrders = await this.exchange.getClosedOrders({
      symbol,
    });

    const affectedBotsIds: number[] = [];

    for (const exchangeOrder of closedOrders) {
      const order = await xprisma.order.findFirst({
        where: {
          exchangeOrderId: exchangeOrder.exchangeOrderId,
        },
        include: {
          smartTrade: true,
        },
      });

      // Check if exchange order is linked to any db order.
      // If `null` then the order was created by the user on Exchange,
      // so this order is not relevant.
      if (!order) continue;

      const orderStatusChanged = await this.syncClosedOrder(
        exchangeOrder,
        order,
      );

      if (orderStatusChanged) {
        if (order.smartTrade.botId) {
          affectedBotsIds.push(order.smartTrade.botId);
        } else {
          console.log(
            `❗ SmartTrade ${order.smartTrade.id} does not belong to any bot`,
          );
        }
      }
    }

    const affectedBotsIdsUnique = affectedBotsIds.filter(
      (value, index, array) => array.indexOf(value) === index,
    );

    return {
      affectedBotsIds: affectedBotsIdsUnique,
    };
  }

  /**
   * Returns `true` if order status changed.
   */
  private async syncClosedOrder(
    exchangeOrder: IClosedOrder,
    order: OrderWithSmartTrade,
  ): Promise<boolean> {
    await xprisma.order.updateSyncedAt(order.id);

    if (exchangeOrder.status === "filled") {
      const statusChanged = order.status !== "Filled";
      if (!statusChanged) return false;

      await xprisma.order.updateStatusToFilled({
        orderId: order.id,
        filledPrice: exchangeOrder.filledPrice,
        filledAt: new Date(exchangeOrder.lastTradeTimestamp),
        fee: exchangeOrder.fee,
      });

      console.log(
        `        -> Filled with price ${exchangeOrder.filledPrice} and fee ${exchangeOrder.fee}`,
      );

      return true;
    } else if (exchangeOrder.status === "canceled") {
      const statusChanged = order.status !== "Canceled";
      if (!statusChanged) return false;

      await xprisma.order.updateStatus("Canceled", order.id);
      console.log(`        -> Canceled`);

      return true;
    }

    return false;
  }
}
