/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
import { NetworkError, RequestTimeout } from "ccxt";
import { ExchangeAccountProcessor } from "@opentrader/processing";
import { logger } from "@opentrader/logger";
import { OrderSynchronizerWatcher } from "./order-synchronizer-watcher.abstract.js";

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
    logger.debug(
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
