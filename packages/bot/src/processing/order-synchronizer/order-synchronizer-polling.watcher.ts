import { NetworkError, RequestTimeout } from "ccxt";
import { ExchangeAccountProcessor } from "@opentrader/processing";
import { logger } from "@opentrader/logger";
import { OrderSynchronizerWatcher } from "./order-synchronizer-watcher.abstract";

/**
 * This is a fallback for `OrderSynchronizerWsWatcher`.
 *
 * Sometimes WebSocket connection me be lost for a while, or the backend server
 * was down. During this time, one of the orders could have been filled.
 */
export class OrderSynchronizerPollingWatcher extends OrderSynchronizerWatcher {
  protocol = "http" as const;

  protected async watchOrders() {
    while (this.enabled) {
      await this.syncOrders();

      // timeout 60s
      logger.debug(`Sync ended. Timeout for 60s`);
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }

  private async syncOrders() {
    logger.info(
      `PollingWatcher: Start syncing order statuses of "${this.exchange.name}"`,
    );
    const processor = new ExchangeAccountProcessor(this.exchange);

    try {
      await processor.syncOrders({
        onFilled: (exchangeOrder, order) =>
          this.emit("onFilled", [exchangeOrder, order]),
        onCanceled: (exchangeOrder, order) =>
          this.emit("onCanceled", [exchangeOrder, order]),
      });
    } catch (err) {
      if (err instanceof NetworkError) {
        logger.info(
          `❕ NetworkError during ExchangeAccountProcessor.syncOrders(): ${err.message}`,
        );
      } else if (err instanceof RequestTimeout) {
        logger.info(
          `❗ RequestTimeout during ExchangeAccountProcessor.syncOrders(): ${err.message}`,
        );
        logger.info(err);
      } else {
        throw err;
      }
    }
  }
}
