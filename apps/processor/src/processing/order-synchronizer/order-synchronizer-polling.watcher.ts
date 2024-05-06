import { NetworkError, RequestTimeout } from "ccxt";
import { ExchangeAccountProcessor } from "@opentrader/processing";
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
      console.debug(`Sync ended. Timeout for 60s`);
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }

  private async syncOrders() {
    console.log(
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
        console.log(
          `❕ NetworkError during ExchangeAccountProcessor.syncOrders(): ${err.message}`,
        );
      } else if (err instanceof RequestTimeout) {
        console.log(
          `❗ RequestTimeout during ExchangeAccountProcessor.syncOrders(): ${err.message}`,
        );
        console.log(err);
      } else {
        throw err;
      }
    }
  }
}
