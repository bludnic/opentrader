import { exchangeProvider, type IExchange } from "@opentrader/exchanges";
import type {
  ExchangeAccountWithCredentials,
  OrderEntity,
  SmartTradeEntity_Order_Order,
  SmartTradeWithOrders,
} from "@opentrader/db";
import {
  assertIsOrderBased,
  toSmartTradeEntity,
  xprisma,
} from "@opentrader/db";
import type { IGetLimitOrderResponse } from "@opentrader/types";
import { OrderNotFound } from "ccxt";

type SyncParams = {
  onFilled: (
    order: OrderEntity,
    exchangeOrder: IGetLimitOrderResponse,
  ) => Promise<void> | void;
  onCanceled: (
    order: OrderEntity,
    exchangeOrder: IGetLimitOrderResponse,
  ) => Promise<void> | void;
};

export class SmartTradeSynchronizer {
  private exchange: IExchange;
  private smartTrade: SmartTradeEntity_Order_Order;
  private exchangeAccount: ExchangeAccountWithCredentials;

  constructor(
    smartTradeModel: SmartTradeWithOrders,
    exchangeAccount: ExchangeAccountWithCredentials,
  ) {
    this.exchangeAccount = exchangeAccount;
    const smartTrade = toSmartTradeEntity(smartTradeModel);

    assertIsOrderBased(smartTrade);

    this.smartTrade = smartTrade;

    this.exchange = exchangeProvider.fromAccount(exchangeAccount);
  }

  static async fromSmartTradeId(id: number) {
    const smartTrade = await xprisma.smartTrade.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });

    return new SmartTradeSynchronizer(smartTrade, smartTrade.exchangeAccount);
  }

  static async fromOrderId(orderId: number) {
    const smartTrade = await xprisma.smartTrade.findFirstOrThrow({
      where: {
        orders: {
          some: {
            id: orderId,
          },
        },
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });

    return new SmartTradeSynchronizer(smartTrade, smartTrade.exchangeAccount);
  }

  /**
   * Manual syncing orders with the exchange. Update statuses in DB.
   * - Sync order status `Placed -> Filled`
   * - Save `fee` to DB if order was filled
   */
  async sync(params: SyncParams) {
    const { entryOrder, takeProfitOrder } = this.smartTrade;
    const orders = [entryOrder, takeProfitOrder].filter(
      (order) => order.status === "Placed",
    );

    for (const order of orders) {
      await this.syncOrder(order, params);
    }
  }

  private async syncOrder(order: OrderEntity, params: SyncParams) {
    const { onFilled, onCanceled } = params;
    console.log(
      `SmartTradeSynchronizer: Syncing order (id: ${order.id}) status with the exchange`,
    );

    if (!order.exchangeOrderId) {
      throw new Error("Order: Missing `exchangeOrderId`");
    }

    console.log(
      `    Sync ${order.side} order #${order.id}: exchangeOrderId "${order.exchangeOrderId}": price: ${order.price}: status: ${order.status}`,
    );
    try {
      const exchangeOrder = await this.exchange.getLimitOrder({
        orderId: order.exchangeOrderId,
        symbol: this.smartTrade.exchangeSymbolId,
      });

      await xprisma.order.updateSyncedAt(order.id);

      if (exchangeOrder.status === "filled") {
        const statusChanged = order.status !== "Filled";
        if (statusChanged) {
          await xprisma.order.updateStatusToFilled({
            orderId: order.id,
            filledPrice: exchangeOrder.filledPrice,
            filledAt: new Date(exchangeOrder.lastTradeTimestamp),
            fee: exchangeOrder.fee,
          });
          console.log(
            `        -> Filled with price ${exchangeOrder.filledPrice} and fee ${exchangeOrder.fee}`,
          );

          // emit onFilled
          await onFilled(order, exchangeOrder);
        }
      } else if (exchangeOrder.status === "canceled") {
        const statusChanged = order.status !== "Canceled";
        if (statusChanged) {
          // Edge case: the user may cancel the order manually on the exchange
          await xprisma.order.updateStatus("Canceled", order.id);
          console.log(`        -> Canceled`);

          // emit onCancelled
          await onCanceled(order, exchangeOrder);
        }
      }
    } catch (err) {
      if (err instanceof OrderNotFound) {
        await xprisma.order.updateStatus("Deleted", order.id);

        console.log(
          `        Order not found on the exchange. Status updated to "Deleted"`,
        );
      } else {
        throw err;
      }
    }
  }
}
