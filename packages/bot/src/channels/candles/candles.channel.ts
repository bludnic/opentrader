import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import type { BarSize, ICandlestick } from "@opentrader/types";
import { logger } from "@opentrader/logger";
import type { CandleEvent } from "./types";
import { CandlesWatcher } from "./candles.watcher";
import { CandlesAggregator } from "./candles.aggregator";

/**
 * Channel that subscribes to 1m candles and aggregate them to higher timeframes.
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

  add(symbol: string, timeframe: BarSize) {
    let aggregator = this.aggregators.find(
      (aggregator) =>
        aggregator.timeframe === timeframe && aggregator.symbol === symbol,
    );

    if (aggregator) {
      logger.warn(
        `Candles aggregator for ${this.exchange.exchangeCode}:${symbol} with ${timeframe} timeframe already exists`,
      );
      return;
    }

    let watcher = this.watchers.find((watcher) => watcher.symbol === symbol);
    if (!watcher) {
      watcher = new CandlesWatcher(symbol, this.exchange);
      watcher.enable();

      this.watchers.push(watcher);
    } else {
      logger.info(
        `Watcher on ${this.exchange.exchangeCode}:${symbol} already exists. Reusing it for ${timeframe} aggregation`,
      );
    }

    aggregator = new CandlesAggregator(timeframe, watcher);
    aggregator.on("candle", (candle: ICandlestick) => {
      const candleEvent: CandleEvent = {
        symbol,
        timeframe,
        candle,
      };

      this.emit("candle", candleEvent);
    });
    this.aggregators.push(aggregator);
  }

  destroy() {
    for (const watcher of this.watchers) {
      watcher.disable();
    }
    logger.info(`Candles channel for ${this.exchange.exchangeCode} destroyed`);
  }

  get exchangeCode() {
    return this.exchange.exchangeCode;
  }
}
