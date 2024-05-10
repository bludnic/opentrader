import { xprisma } from "@opentrader/db";
import { NetworkError, RequestTimeout } from "ccxt";
import { logger } from "@opentrader/logger";
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
          logger.info(
            `Websocket: OrderID ${exchangeOrder.exchangeOrderId}: Price: ${exchangeOrder.price}: Status: ${exchangeOrder.status}`,
          );

          const order = await xprisma.order.findByExchangeOrderId(
            exchangeOrder.exchangeOrderId,
          );

          if (!order) {
            logger.info(`Order "${exchangeOrder.exchangeOrderId}" is not linked to any SmartTrade`);
            continue;
          }

          const { smartTrade } = order;

          logger.debug(
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
          logger.info(`❕ NetworkError: ${err.message}. Timeout: 3s`);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents infinite cycle
          // https://github.com/ccxt/ccxt/issues/7951
          // if the connection is dropped, you should catch the NetworkError exception
          // and your next call should reconnect in the background
        } else if (err instanceof RequestTimeout) {
          logger.error(err, `❗ RequestTimeout: ${err.message}`);
        } else {
          logger.error(
            err,
            "‼️ Unhandled error occurred. Disabling WS connection.",
          );
          await this.disable();
          break;
        }
      }
    }
  }
}
