import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import type { BarSize, ICandlestick } from "@opentrader/types";
import { logger } from "@opentrader/logger";
import type { CandleEvent } from "./types.js";
import { CandlesWatcher } from "./candles.watcher.js";
import { CandlesAggregator } from "./candles.aggregator.js";

/**
 * Channel that subscribes to 1m candles of specific exchange
 * and aggregate them to higher timeframes.
 *
 * Emits:
 * - candle: `CandleEvent`
 *
 * @example
 * ```ts
 * const exchange = exchangeProvider.fromCode(ExchangeCode.OKX);
 *
 * const channel = new CandlesChannel(exchange);
 * channel.add("BTC/USDT", "5m");
 * channel.add("ETH/USDT", "5m");
 * channel.add("ETH/USDT", "15m");
 *
 * channel.on("candle", (candle) => {
 *   logger.info(candle, "Candle received");
 * });
 * ```
 */
export class CandlesChannel extends EventEmitter {
  private readonly exchange: IExchange;
  private aggregators: CandlesAggregator[] = [];
  private watchers: CandlesWatcher[] = [];

  constructor(exchange: IExchange) {
    super();

    this.exchange = exchange;
  }

  async add(symbol: string, timeframe: BarSize, requiredHistory?: number) {
    let aggregator = this.aggregators.find(
      (aggregator) => aggregator.timeframe === timeframe && aggregator.symbol === symbol,
    );

    // if aggregator already exists, just download required history,
    // not need to enable it again
    if (aggregator) {
      logger.warn(
        `[CandlesChannel] Candles aggregator for ${this.exchange.exchangeCode}:${symbol} with ${timeframe} timeframe already exists`,
      );
      await aggregator.init(requiredHistory);

      return;
    }

    let watcher = this.watchers.find((watcher) => watcher.symbol === symbol);
    if (!watcher) {
      watcher = new CandlesWatcher(symbol, this.exchange);

      this.watchers.push(watcher);
    } else {
      logger.info(
        `[CandlesChannel] Watcher on ${this.exchange.exchangeCode}:${symbol} already exists. Reusing it for ${timeframe} aggregation`,
      );
    }

    aggregator = new CandlesAggregator(timeframe, watcher, this.exchange);
    aggregator.on("candle", (candle: ICandlestick, history: ICandlestick[]) => {
      const candleEvent: CandleEvent = {
        symbol,
        timeframe,
        candle,
        history,
      };

      this.emit("candle", candleEvent);
    });
    await aggregator.init(requiredHistory);
    this.aggregators.push(aggregator);

    // it's important to enable the aggregator first,
    // otherwise, the watcher may emit a "candle" event
    // to the aggregator, while not being ready
    aggregator.enable();
    watcher.enable();
  }

  destroy() {
    // it's important to disable watchers first
    // otherwise, the watcher may emit a "candle" event
    // that wthe aggregator will try to process
    for (const watcher of this.watchers) {
      watcher.disable();
    }
    this.watchers = [];

    for (const aggregator of this.aggregators) {
      aggregator.disable();
    }
    this.aggregators = [];

    logger.info(`[CandlesChannel] Candles channel for ${this.exchange.exchangeCode} destroyed`);
  }

  getWatchers() {
    return this.watchers;
  }

  getAggregators() {
    return this.aggregators;
  }

  removeAggregator(aggregator: CandlesAggregator) {
    aggregator.disable();

    const aggregatorsLengthBefore = this.aggregators.length;
    this.aggregators = this.aggregators.filter((a) => a !== aggregator);

    // @todo remove and add tests for this
    if (aggregatorsLengthBefore === this.aggregators.length) {
      logger.error(
        `[CandlesChannel] Cannot remove ${this.exchangeCode}:${aggregator.symbol}#${aggregator.timeframe} aggregator. Reason: not found`,
      );
    }
  }

  removeWatcher(watcher: CandlesWatcher) {
    watcher.disable();

    const watchersLengthBefore = this.watchers.length;
    this.watchers = this.watchers.filter((w) => w !== watcher);

    // @todo remove
    if (watchersLengthBefore === this.watchers.length) {
      logger.error(`[CandlesChannel] Cannot remove ${watcher.symbol} watcher. Reason: not found`);
    }
  }

  get exchangeCode() {
    return this.exchange.exchangeCode;
  }
}
