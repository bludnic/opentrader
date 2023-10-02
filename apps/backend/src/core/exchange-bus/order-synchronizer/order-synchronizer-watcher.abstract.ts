import { exchanges, IExchange } from '@opentrader/exchanges';
import { IWatchOrder } from '@opentrader/types';
import { Logger } from '@nestjs/common';
import { ExchangeAccountWithCredentials } from 'src/trpc/prisma/types/exchange-account/exchange-account-with-credentials';
import { OrderWithSmartTrade } from 'src/trpc/prisma/types/order/order-with-smart-trade';

type Event = 'onFilled' | 'onCanceled';

type Subscription = {
  event: Event;
  callback: (exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) => void;
};

export abstract class OrderSynchronizerWatcher {
  protected abstract logger: Logger;

  private consumers: Subscription[] = [];
  protected enabled: boolean = false;

  protected exchange: ExchangeAccountWithCredentials;
  protected exchangeService: IExchange;

  constructor(exchange: ExchangeAccountWithCredentials) {
    this.exchange = exchange;
    this.exchangeService = exchanges[exchange.exchangeCode](
      exchange.credentials,
    );
  }

  async enable() {
    this.logger.debug(
      `Created watcher for ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );

    this.enabled = true;
    this.watchOrders(); // await was omitted intentionally
  }

  async disable() {
    this.enabled = false;

    this.logger.debug(
      `Destroyed watcher of ExchangeAccount #${this.exchange.id}: ${this.exchange.name}`,
    );
  }

  protected abstract watchOrders(): void;

  /**
   * Subscribe to or filled / canceled events.
   */
  subscribe(event: Event, callback: Subscription['callback']) {
    this.consumers.push({
      event,
      callback,
    });
  }

  unsubscribe(event: Event, callback: Subscription['callback']) {
    // remove consumer from array
    this.consumers = this.consumers.filter(
      (consumer) => consumer.callback !== callback,
    );
  }

  unsubscribeAll() {
    this.consumers = [];
  }

  emit(event: Event, args: Parameters<Subscription['callback']>) {
    const consumers = this.consumers.filter(
      (consumer) => consumer.event === event,
    );

    for (const consumer of consumers) {
      consumer.callback(...args);
    }
  }
}
