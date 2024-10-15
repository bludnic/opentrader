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
import { ExchangeCode } from "@opentrader/types";

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
          logger.debug(
            `Websocket: OrderID ${exchangeOrder.exchangeOrderId}: Price: ${exchangeOrder.price}: Status: ${exchangeOrder.status}`,
          );

          const order = await xprisma.order.findByExchangeOrderId(exchangeOrder.exchangeOrderId);

          if (!order) {
            logger.info(`Order "${exchangeOrder.exchangeOrderId}" is not linked to any SmartTrade`);
            continue;
          }

          const { smartTrade } = order;

          logger.debug(`Order #${order.id} is linked to SmartTrade with ID: ${smartTrade.id}`);

          // Orders what are emitted with status "open" may be stalled.
          // For example, if the order was filled immediately (typically with market orders),
          // the exchange may emit only "open" status, and skip "filled" status.
          let actualExchangeOrder = exchangeOrder;
          if (actualExchangeOrder.status === "open") {
            logger.debug(
              actualExchangeOrder,
              `[WS] Emitted order ID:${actualExchangeOrder.exchangeOrderId} with status "open". It may be stalled, fetching actual status by REST...`,
            );

            // get the actual status of the order (it may be stalled, if was filled immediately)
            actualExchangeOrder = await this.exchangeService.getLimitOrder({
              orderId: exchangeOrder.exchangeOrderId,
              symbol: order.symbol,
            });
            logger.debug(
              actualExchangeOrder,
              `[WS] Fetched order ID:${actualExchangeOrder.exchangeOrderId} with status: ${actualExchangeOrder.status}`,
            );
          }

          if (actualExchangeOrder.status === "open") {
            this.emit("onPlaced", [actualExchangeOrder, order, this.exchange.exchangeCode as ExchangeCode]);
          } else if (actualExchangeOrder.status === "filled") {
            const statusChanged = order.status !== "Filled";

            if (statusChanged) {
              this.emit("onFilled", [actualExchangeOrder, order, this.exchange.exchangeCode as ExchangeCode]);
            }
          } else if (actualExchangeOrder.status === "canceled") {
            const statusChanged = order.status !== "Canceled";

            if (statusChanged) {
              this.emit("onCanceled", [actualExchangeOrder, order, this.exchange.exchangeCode as ExchangeCode]);
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
