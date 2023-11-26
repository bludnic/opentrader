import { xprisma } from "@opentrader/db";
import { NetworkError } from "ccxt";
import { OrderSynchronizerWatcher } from "./order-synchronizer-watcher.abstract";

export class OrderSynchronizerWsWatcher extends OrderSynchronizerWatcher {
  protocol = "ws" as const;

  async disable() {
    await super.disable();
    await this.exchangeService.ccxt.close();
  }

  protected async watchOrders() {
    while (this.enabled) {
      try {
        const exchangeOrders = await this.exchangeService.watchOrders();

        for (const exchangeOrder of exchangeOrders) {
          console.debug(
            `Websocket: OrderID ${exchangeOrder.exchangeOrderId}: Price: ${exchangeOrder.price}: Status: ${exchangeOrder.status}`,
          );

          const order = await xprisma.order.findByExchangeOrderId(
            exchangeOrder.exchangeOrderId,
          );

          if (!order) {
            console.debug("Order is not linked to any SmartTrade");
            continue;
          }

          const { smartTrade } = order;

          console.debug(
            `Order #${order.id} is linked to SmartTrade with ID: ${smartTrade.id}`,
          );

          if (exchangeOrder.status === "open") {
            // get the actual status of the order (it may be stalled, if was filled immediately)
            const actualExchangeOrder =
              await this.exchangeService.getLimitOrder({
                orderId: exchangeOrder.exchangeOrderId,
                symbol: smartTrade.exchangeSymbolId,
              });

            this.emit("onPlaced", [actualExchangeOrder, order]);
          } else if (exchangeOrder.status === "filled") {
            const statusChanged = order.status !== "Filled";

            if (statusChanged) {
              this.emit("onFilled", [exchangeOrder, order]);
            }
          } else if (exchangeOrder.status === "canceled") {
            const statusChanged = order.status !== "Canceled";

            if (statusChanged) {
              this.emit("onCanceled", [exchangeOrder, order]);
            }
          }
        }
      } catch (err) {
        if (err instanceof NetworkError) {
          console.log("❗ NetworkError occurred. Possible WS connection lost.");
          // https://github.com/ccxt/ccxt/issues/7951
          // if the connection is dropped, you should catch the NetworkError exception
          // and your next call should reconnect in the background

          // @todo RequestTimeout reconnect on error
        } else {
          console.log(err);
          await this.disable();
          break;
        }
      }
    }
  }
}
