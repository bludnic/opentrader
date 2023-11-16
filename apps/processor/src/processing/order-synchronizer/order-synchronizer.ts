import { ExchangeAccountWithCredentials } from "@opentrader/db";
import { OrderSynchronizerPollingWatcher } from "./order-synchronizer-polling.watcher";
import { OrderSynchronizerWsWatcher } from "./order-synchronizer-ws.watcher";
import type { Event, Subscription } from "./types";

export class OrderSynchronizer {
  private consumers: Subscription[] = [];

  private wsWatcher: OrderSynchronizerWsWatcher;
  private pollingWatcher: OrderSynchronizerPollingWatcher;

  constructor(exchangeAccount: ExchangeAccountWithCredentials) {
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
  subscribe(event: Event, callback: Subscription["callback"]) {
    this.consumers.push({
      event,
      callback,
    });
  }

  unsubscribe(event: Event, callback: Subscription["callback"]) {
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

  private emit(event: Event, args: Parameters<Subscription["callback"]>) {
    const consumers = this.consumers.filter(
      (consumer) => consumer.event === event,
    );

    for (const consumer of consumers) {
      consumer.callback(...args);
    }
  }
}
