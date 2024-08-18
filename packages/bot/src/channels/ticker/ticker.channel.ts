import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { ITicker, MarketId } from "@opentrader/types";
import type { TickerEvent } from "./types.js";
import { TickerWatcher } from "./ticker.watcher.js";

/**
 * Channel that subscribes to the ticker on specific symbol.
 *
 * Emits:
 * - ticker: `TickerEvent`
 *
 * @example
 * ```ts
 * const exchange = exchangeProvider.fromCode(ExchangeCode.OKX);
 *
 * const channel = new TickerChannel(exchange);
 * channel.add("BTC/USDT");
 * channel.add("ETH/USDT");
 * channel.add("ETH/USDT");
 *
 * channel.on("ticker", (ticker) => {
 *   logger.info(ticker, "Ticker event received");
 * });
 * ```
 */
export class TickerChannel extends EventEmitter {
  private readonly exchange: IExchange;
  private watchers: TickerWatcher[] = [];

  constructor(exchange: IExchange) {
    super();

    this.exchange = exchange;
  }

  async add(symbol: string) {
    let watcher = this.watchers.find((watcher) => watcher.symbol === symbol);
    if (!watcher) {
      watcher = new TickerWatcher(symbol, this.exchange);
      watcher.on("ticker", this.handleTicker);

      this.watchers.push(watcher);
    } else {
      logger.info(`[TickerChannel] Watcher on ${this.exchange.exchangeCode}:${symbol} already exists. Reusing it.`);
    }

    watcher.enable();
  }

  handleTicker = (ticker: ITicker) => {
    const event: TickerEvent = {
      exchangeCode: this.exchangeCode,
      marketId: `${this.exchangeCode}:${ticker.symbol}` as MarketId,
      symbol: ticker.symbol,
      ticker,
    };

    this.emit("ticker", event);
  };

  destroy() {
    for (const watcher of this.watchers) {
      watcher.off("ticker", this.handleTicker);
      watcher.disable();
    }
    this.watchers = [];

    logger.info(`[TickerChannel] Channel for ${this.exchange.exchangeCode} destroyed`);
  }

  getWatchers() {
    return this.watchers;
  }

  removeWatcher(watcher: TickerWatcher) {
    watcher.disable();

    this.watchers = this.watchers.filter((w) => w !== watcher);
  }

  get exchangeCode() {
    return this.exchange.exchangeCode;
  }
}
