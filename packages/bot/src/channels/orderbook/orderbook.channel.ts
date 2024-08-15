import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { IOrderbook } from "@opentrader/types";
import type { OrderbookEvent } from "./types.js";
import { OrderbookWatcher } from "./orderbook.watcher.js";

/**
 * Channel that subscribes to the orderbook on specific symbol.
 *
 * Emits:
 * - orderbook: `OrderbookEvent`
 *
 * @example
 * ```ts
 * const exchange = exchangeProvider.fromCode(ExchangeCode.OKX);
 *
 * const channel = new OrderbookChannel(exchange);
 * channel.add("BTC/USDT");
 * channel.add("ETH/USDT");
 * channel.add("ETH/USDT");
 *
 * channel.on("orderbook", (orderbook) => {
 *   logger.info(orderbook, "New orderbook snapshot");
 * });
 * ```
 */
export class OrderbookChannel extends EventEmitter {
  private readonly exchange: IExchange;
  private watchers: OrderbookWatcher[] = [];

  constructor(exchange: IExchange) {
    super();

    this.exchange = exchange;
  }

  async add(symbol: string) {
    let watcher = this.watchers.find((watcher) => watcher.symbol === symbol);
    if (!watcher) {
      watcher = new OrderbookWatcher(symbol, this.exchange);
      watcher.on("orderbook", this.handleOrderbook);

      this.watchers.push(watcher);
    } else {
      logger.info(`[OrderbookChannel] Watcher on ${this.exchange.exchangeCode}:${symbol} already exists. Reusing it.`);
    }

    watcher.enable();
  }

  handleOrderbook = (orderbook: IOrderbook) => {
    const event: OrderbookEvent = {
      symbol: orderbook.symbol,
      orderbook,
    };

    this.emit("orderbook", event);
  };

  destroy() {
    for (const watcher of this.watchers) {
      watcher.off("orderbook", this.handleOrderbook);
      watcher.disable();
    }
    this.watchers = [];

    logger.info(`[OrderbookChannel] Orderbook channel for ${this.exchange.exchangeCode} destroyed`);
  }

  getWatchers() {
    return this.watchers;
  }

  removeWatcher(watcher: OrderbookWatcher) {
    watcher.disable();

    this.watchers = this.watchers.filter((w) => w !== watcher);
  }

  get exchangeCode() {
    return this.exchange.exchangeCode;
  }
}
