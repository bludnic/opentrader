import { exchangeProvider, IExchange } from "@opentrader/exchanges";
import { ExchangeAccountWithCredentials } from "@opentrader/db";
import type { Subscription, Event } from "./types";

export abstract class OrderSynchronizerWatcher {
  private consumers: Subscription[] = [];
  protected enabled: boolean = false;

  protected exchange: ExchangeAccountWithCredentials;
  protected exchangeService: IExchange;

  abstract protocol: "ws" | "http";

  constructor(exchangeAccount: ExchangeAccountWithCredentials) {
    this.exchange = exchangeAccount;
    this.exchangeService = exchangeProvider.fromAccount(exchangeAccount);
  }

  // @todo remove async
  async enable() {
    console.debug(
      `Created watcher for ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );

    this.enabled = true;
    void this.watchOrders(); // await was omitted intentionally
  }

  async disable() {
    this.enabled = false;

    console.debug(
      `Destroyed ${this.protocol.toUpperCase()} watcher of ExchangeAccount #${
        this.exchange.id
      }: ${this.exchange.name}`,
    );
  }

  protected abstract watchOrders(): void;

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

  protected emit(event: Event, args: Parameters<Subscription["callback"]>) {
    const consumers = this.consumers.filter(
      (consumer) => consumer.event === event,
    );

    for (const consumer of consumers) {
      consumer.callback(...args);
    }
  }
}
