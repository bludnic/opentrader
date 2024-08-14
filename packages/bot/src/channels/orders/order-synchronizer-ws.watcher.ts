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
import { xprisma } from "@opentrader/db";
import { ExchangeClosedByUser, NetworkError, RequestTimeout } from "ccxt";
import { logger } from "@opentrader/logger";
import { OrderSynchronizerWatcher } from "./order-synchronizer-watcher.abstract.js";

export class OrderSynchronizerWsWatcher extends OrderSynchronizerWatcher {
  protocol = "ws" as const;

  override async disable() {
    await super.disable();
    await this.exchangeService.destroy();
  }

  protected async watchOrders() {
    while (this.enabled) {
      try {
        const exchangeOrders = await this.exchangeService.watchOrders();

        for (const exchangeOrder of exchangeOrders) {
          logger.info(
            `Websocket: OrderID ${exchangeOrder.exchangeOrderId}: Price: ${exchangeOrder.price}: Status: ${exchangeOrder.status}`,
          );

          const order = await xprisma.order.findByExchangeOrderId(exchangeOrder.exchangeOrderId);

          if (!order) {
            logger.info(`Order "${exchangeOrder.exchangeOrderId}" is not linked to any SmartTrade`);
            continue;
          }

          const { smartTrade } = order;

          logger.debug(`Order #${order.id} is linked to SmartTrade with ID: ${smartTrade.id}`);

          if (exchangeOrder.status === "open") {
            // get the actual status of the order (it may be stalled, if was filled immediately)
            const actualExchangeOrder = await this.exchangeService.getLimitOrder({
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
          logger.warn(`[OrderSynchronizerWs] NetworkError occurred: ${err.message}. Timeout: 3s`);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents infinite cycle
          // https://github.com/ccxt/ccxt/issues/7951
          // if the connection is dropped, you should catch the NetworkError exception
          // and your next call should reconnect in the background
        } else if (err instanceof RequestTimeout) {
          logger.warn(err, `[OrderSynchronizerWs] RequestTimeout occurred: ${err.message}`);
        } else if (err instanceof ExchangeClosedByUser) {
          // This is an expected error when shutting down the daemon by running disable() method
          logger.info("[OrderSynchronizerWs] ExchangeClosedByUser");
          break; // is it necessary, when `this.enabled` is already `false`?
        } else {
          logger.error(err, "[OrderSynchronizerWs] ‼️ Unhandled error occurred. Disabling WS connection.");
          await this.disable();
          break;
        }
      }
    }
  }
}
