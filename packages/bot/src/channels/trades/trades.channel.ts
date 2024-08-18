import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { ITrade, MarketId } from "@opentrader/types";
import type { TradeEvent } from "./types.js";
import { TradesWatcher } from "./trades.watcher.js";

/**
 * Channel that subscribes to public trades on specific symbol.
 *
 * Emits:
 * - trade: `TradeEvent`
 *
 * @example
 * ```ts
 * const exchange = exchangeProvider.fromCode(ExchangeCode.OKX);
 *
 * const channel = new TradesChannel(exchange);
 * channel.add("BTC/USDT");
 * channel.add("ETH/USDT");
 * channel.add("ETH/USDT");
 *
 * channel.on("trade", (trade) => {
 *   logger.info(trade, "New trade");
 * });
 * ```
 */
export class TradesChannel extends EventEmitter {
  private readonly exchange: IExchange;
  private watchers: TradesWatcher[] = [];

  constructor(exchange: IExchange) {
    super();

    this.exchange = exchange;
  }

  async add(symbol: string) {
    let watcher = this.watchers.find((watcher) => watcher.symbol === symbol);
    if (!watcher) {
      watcher = new TradesWatcher(symbol, this.exchange);
      watcher.on("trade", this.handleTrade);

      this.watchers.push(watcher);
    } else {
      logger.info(`[TradesChannel] Watcher on ${this.exchange.exchangeCode}:${symbol} already exists. Reusing it.`);
    }

    watcher.enable();
  }

  handleTrade = (trade: ITrade) => {
    const tradeEvent: TradeEvent = {
      exchangeCode: this.exchangeCode,
      marketId: `${this.exchangeCode}:${trade.symbol}` as MarketId,
      symbol: trade.symbol,
      trade,
    };

    this.emit("trade", tradeEvent);
  };

  destroy() {
    for (const watcher of this.watchers) {
      watcher.off("trade", this.handleTrade);
      watcher.disable();
    }
    this.watchers = [];

    logger.info(`[TradesChannel] Trades channel for ${this.exchange.exchangeCode} destroyed`);
  }

  getWatchers() {
    return this.watchers;
  }

  removeWatcher(watcher: TradesWatcher) {
    watcher.disable();

    this.watchers = this.watchers.filter((w) => w !== watcher);
  }

  get exchangeCode() {
    return this.exchange.exchangeCode;
  }
}
