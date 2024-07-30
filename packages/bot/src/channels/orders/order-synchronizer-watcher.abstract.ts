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
import type { IExchange } from "@opentrader/exchanges";
import { exchangeProvider } from "@opentrader/exchanges";
import type { ExchangeAccountWithCredentials } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import type { Subscription, OrderEvent } from "./types.js";

export abstract class OrderSynchronizerWatcher {
  private consumers: Subscription[] = [];
  protected enabled = false;

  protected exchange: ExchangeAccountWithCredentials;
  protected exchangeService: IExchange;

  abstract protocol: "ws" | "http";

  constructor(exchangeAccount: ExchangeAccountWithCredentials) {
    this.exchange = exchangeAccount;
    this.exchangeService = exchangeProvider.fromAccount(exchangeAccount);
  }

  // @todo remove async
  async enable() {
    logger.debug(
      `Created watcher for ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );

    this.enabled = true;
    this.watchOrders(); // await was omitted intentionally
  }

  async disable() {
    this.enabled = false;

    logger.debug(
      `Destroyed ${this.protocol.toUpperCase()} watcher of ExchangeAccount #${
        this.exchange.id
      }: ${this.exchange.name}`,
    );
  }

  protected abstract watchOrders(): void;

  /**
   * Subscribe to filled/canceled order events.
   */
  subscribe(event: OrderEvent, callback: Subscription["callback"]) {
    this.consumers.push({
      event,
      callback,
    });
  }

  unsubscribe(event: OrderEvent, callback: Subscription["callback"]) {
    // remove consumer from array
    this.consumers = this.consumers.filter(
      (consumer) => consumer.callback !== callback,
    );
  }

  unsubscribeAll() {
    this.consumers = [];
  }

  protected emit(event: OrderEvent, args: Parameters<Subscription["callback"]>) {
    const consumers = this.consumers.filter(
      (consumer) => consumer.event === event,
    );

    for (const consumer of consumers) {
      consumer.callback(...args);
    }
  }
}
