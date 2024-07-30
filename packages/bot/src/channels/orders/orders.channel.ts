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
import type { ExchangeAccountWithCredentials } from "@opentrader/db";
import { OrderSynchronizerPollingWatcher } from "./order-synchronizer-polling.watcher.js";
import { OrderSynchronizerWsWatcher } from "./order-synchronizer-ws.watcher.js";
import type { OrderEvent, Subscription } from "./types.js";

export class OrdersChannel {
  private consumers: Subscription[] = [];

  private wsWatcher: OrderSynchronizerWsWatcher;
  private pollingWatcher: OrderSynchronizerPollingWatcher;

  constructor(public exchangeAccount: ExchangeAccountWithCredentials) {
    this.wsWatcher = new OrderSynchronizerWsWatcher(exchangeAccount);
    this.pollingWatcher = new OrderSynchronizerPollingWatcher(exchangeAccount);
  }

  async enable() {
    this.wsWatcher.subscribe("onFilled", (...args) =>
      this.emit("onFilled", args),
    );
    this.wsWatcher.subscribe("onCanceled", (...args) =>
      this.emit("onCanceled", args),
    );
    this.wsWatcher.subscribe("onPlaced", (...args) =>
      this.emit("onPlaced", args),
    );
    await this.wsWatcher.enable();

    this.pollingWatcher.subscribe("onFilled", (...args) =>
      this.emit("onFilled", args),
    );
    this.pollingWatcher.subscribe("onCanceled", (...args) =>
      this.emit("onCanceled", args),
    );
    await this.pollingWatcher.enable();
  }

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

  async disable() {
    await this.wsWatcher.disable();
    await this.pollingWatcher.disable();
  }

  private emit(event: OrderEvent, args: Parameters<Subscription["callback"]>) {
    const consumers = this.consumers.filter(
      (consumer) => consumer.event === event,
    );

    for (const consumer of consumers) {
      consumer.callback(...args);
    }
  }
}
