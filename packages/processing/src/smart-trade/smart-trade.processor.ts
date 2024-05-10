import { exchangeProvider, type IExchange } from "@opentrader/exchanges";
import type {
  ExchangeAccountWithCredentials,
  OrderEntity,
  SmartTradeEntity_Order_Order,
  SmartTradeWithOrders,
} from "@opentrader/db";
import {
  assertHasExchangeOrderId,
  assertIsOrderBased,
  toSmartTradeEntity,
  xprisma,
} from "@opentrader/db";
import type {
  IGetLimitOrderResponse,
  IPlaceLimitOrderResponse,
} from "@opentrader/types";
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

export class SmartTradeProcessor {
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

    return new SmartTradeProcessor(smartTrade, smartTrade.exchangeAccount);
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

    return new SmartTradeProcessor(smartTrade, smartTrade.exchangeAccount);
  }

  /**
   * Will place Entry Order if not placed before.
   * OR
   * Will place takeProfit order if Entry Order was filled.
   */
  async placeNext() {
    const { entryOrder, takeProfitOrder } = this.smartTrade;

    const orderPendingPlacement =
      entryOrder.status === "Idle"
        ? entryOrder
        : entryOrder.status === "Filled" && takeProfitOrder.status === "Idle"
          ? takeProfitOrder
          : null;

    if (orderPendingPlacement) {
      const exchangeOrder = await this.placeOrder(orderPendingPlacement);
      console.log(
        `⚙️ @SmartTradeProcessor.placeNext(): Order #${orderPendingPlacement.id} placed`,
      );
      console.log(exchangeOrder);
    }
  }

  private async placeOrder(
    order: OrderEntity,
  ): Promise<IPlaceLimitOrderResponse> {
    if (order.type === "Market") {
      throw new Error("placeOrder: Market order is not supported yet");
    }

    const exchangeOrder = await this.exchange.placeLimitOrder({
      symbol: this.smartTrade.exchangeSymbolId,
      side: order.side === "Buy" ? "buy" : "sell", // @todo map helper
      price: order.price,
      quantity: order.quantity,
    });

    // Update status to Placed
    // Save exchange orderId to DB
    await xprisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "Placed",
        exchangeOrderId: exchangeOrder.orderId,
        placedAt: new Date(), // maybe use Exchange time (if possible)
      },
    });

    return exchangeOrder;
  }

  /**
   * Will cancel all orders that belongs to the SmartTrade
   */
  async cancelOrders() {
    console.log(
      "⚙️ @opentrader/processing: SmartTradeProcessor.cancelOrders()",
    );
    const { entryOrder, takeProfitOrder } = this.smartTrade;

    await this.cancelOrder(entryOrder);
    await this.cancelOrder(takeProfitOrder);
  }

  private async cancelOrder(order: OrderEntity) {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- "Canceled" | "Revoked" | "Deleted" doesn't require to be processed
    switch (order.status) {
      case "Idle":
        await xprisma.order.updateStatus("Revoked", order.id);
        console.log(`    Canceled order #${order.id}: Idle -> Revoked`);
        return;
      case "Placed":
        assertHasExchangeOrderId(order);

        try {
          await this.exchange.cancelLimitOrder({
            orderId: order.exchangeOrderId,
            symbol: this.smartTrade.exchangeSymbolId,
          });
          await xprisma.order.updateStatus("Canceled", order.id);

          console.log(`    Canceled order #${order.id}: Placed -> Canceled`);
        } catch (err) {
          if (err instanceof OrderNotFound) {
            await xprisma.order.updateStatus("Deleted", order.id);

            console.log(
              `    Canceled order #${order.id}: Placed -> Deleted (order not found on the exchange)`,
            );
          } else {
            throw err;
          }
        }
        return;
      case "Filled":
        await xprisma.order.removeRef(order.id);
    }
  }

  /**
   * Sync orders: `exchange -> db`
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
    console.log("⚙️ @opentrader/processing");

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
