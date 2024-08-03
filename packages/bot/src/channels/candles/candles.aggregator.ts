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
import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { barSizeToDuration } from "@opentrader/tools";
import { BarSize } from "@opentrader/types";
import { format } from "@opentrader/logger";
import type { ICandlestick } from "@opentrader/types";
import type { CandlesWatcher } from "./candles.watcher.js";

/**
 * Aggregates 1m candles to higher timeframes.
 *
 * Emits:
 * - candle(lastCandle: `ICandlestick`, candlesHistory: ICandlestick[]): void
 */
export class CandlesAggregator extends EventEmitter {
  private exchange: IExchange;
  public timeframe: BarSize;

  /**
   * Bucket size in minutes.
   */
  private readonly bucketSize: number;
  /**
   * Storing 1m candles for further aggregation.
   */
  private bucket: ICandlestick[] = [];
  /**
   * Pushing aggregated candles to history.
   */
  private candlesHistory: ICandlestick[] = [];
  private candlesWatcher: CandlesWatcher;
  private enabled = false;

  constructor(timeframe: BarSize, candlesWatcher: CandlesWatcher, exchange: IExchange) {
    super();

    this.exchange = exchange;
    this.timeframe = timeframe;
    this.bucketSize = barSizeToDuration(timeframe) / 60000; // convert ms to minutes
    this.candlesWatcher = candlesWatcher;
  }

  private handleCandle = (candle: ICandlestick) => {
    if (!this.enabled) {
      const { exchangeCode } = this.exchange;
      const { symbol } = this.candlesWatcher;
      logger.error(
        `[CandlesAggregator] Cannot handle candle ${format.candle(candle)} for ${exchangeCode}:${symbol}#${this.timeframe}. Reason: Aggregator is disabled.`,
      );
      return;
    }

    const lastCandle = this.bucket[this.bucket.length - 1];
    if (candle.timestamp < lastCandle?.timestamp) {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Candle timestamp ${new Date(candle.timestamp).toISOString()} is older than last candle (${new Date(lastCandle.timestamp).toISOString()}) in the bucket. Skipping.`,
      );

      return;
    }

    if (candle.timestamp === lastCandle?.timestamp) {
      logger.debug(
        `[${this.symbol}#${this.timeframe}] Updated OHLCV of ${new Date(candle.timestamp).toISOString()} candle. Bucket length is ${this.bucket.length}/${this.bucketSize}`,
      );
      lastCandle.open = candle.open;
      lastCandle.high = Math.max(candle.high, lastCandle.high);
      lastCandle.low = Math.min(candle.low, lastCandle.low);
      lastCandle.close = candle.close;

      return;
    }

    const lastTimestamp = lastCandle?.timestamp;
    if (lastTimestamp && candle.timestamp !== lastTimestamp + 60000) {
      const missedCandlesCount = (candle.timestamp - lastTimestamp) / 60000 - 1;
      logger.warn(
        `[${this.symbol}#${this.timeframe}] Missed ${missedCandlesCount} × 1-minute candles, likely due unstable WS connection. ` +
          `Last candle in the bucket: ${new Date(lastTimestamp).toISOString()}. ` +
          `Recent candle: ${new Date(candle.timestamp).toISOString()}.`,
      );

      this.fillGaps(lastCandle, candle);
      this.bucket.push(candle); // push the recent candle to the bucket after filling the gaps

      while (this.bucket.length >= this.bucketSize + 1) {
        const aggregatedCandle = this.aggregate();
        this.candlesHistory.push(aggregatedCandle);
        this.emit("candle", aggregatedCandle, this.candlesHistory); // emit for every missed candle

        logger.info(
          `[${this.symbol}#${this.timeframe}] Aggregated a candle (from gaps): O: ${aggregatedCandle.open}, H: ${aggregatedCandle.high}, L: ${aggregatedCandle.low}, C: ${aggregatedCandle.close} at ${new Date(aggregatedCandle.timestamp).toISOString()}`,
        );
      }

      return;
    }

    const isFirstCandle = candle.timestamp % (this.bucketSize * 60000) === 0;
    if (this.bucket.length > 0 || isFirstCandle) {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Pushed ${isFirstCandle ? "first " : ""}candle ${new Date(candle.timestamp).toISOString()}. Bucket length is ${this.bucket.length}/${this.bucketSize}`,
      );

      this.bucket.push(candle);
      this.aggregateAndEmit();
    } else {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Candle ${new Date(candle.timestamp).toISOString()} is not divisible by ${this.timeframe} bucket. Skipping.`,
      );
    }
  };

  private aggregateAndEmit() {
    // The `this.bucketSize + 1` is used to confirm that the last candle has fully closed
    // before proceeding with aggregation.
    if (this.bucket.length >= this.bucketSize + 1) {
      const candle = this.aggregate();
      this.candlesHistory.push(candle);

      logger.info(
        `[${this.symbol}#${this.timeframe}] Aggregated candle: O: ${candle.open}, H: ${candle.high}, L: ${candle.low}, C: ${candle.close} at ${new Date(candle.timestamp).toISOString()}`,
      );
      this.emit("candle", candle, this.candlesHistory);

      return;
    }
  }

  private aggregate(): ICandlestick {
    const candles = this.bucket.splice(0, this.bucketSize);

    return aggregateCandles(candles);
  }

  async init(requiredHistory?: number) {
    if (!this.enabled) {
      await this.downloadLastCandle();
    }

    if (requiredHistory) {
      await this.warmup(requiredHistory);
    }
  }

  enable() {
    this.candlesWatcher.on("candle", this.handleCandle);
    this.enabled = true;
  }

  disable() {
    this.candlesWatcher.off("candle", this.handleCandle);
    this.enabled = false;
  }

  /**
   * Populate the gaps in the bucket with closed price of the last candle.
   * @param lastCandle Last candle in the bucket
   * @param recentCandle Recent candle received from watcher
   * @private
   */
  private fillGaps(lastCandle: ICandlestick, recentCandle: ICandlestick) {
    for (let timestamp = lastCandle.timestamp + 60000; timestamp < recentCandle.timestamp; timestamp += 60000) {
      // Using the close price of the last candle to fill the gaps
      this.bucket.push({
        timestamp,
        open: lastCandle.close,
        high: lastCandle.close,
        low: lastCandle.close,
        close: lastCandle.close,
      });
      logger.info(`[${this.symbol}#${this.timeframe}] Filled gap for ${new Date(timestamp).toISOString()} candle`);
    }
  }

  /**
   * Download and aggregated last closed candle.
   * E.g., if timeframe is 1d, it will download 1m candles for the last day and aggregate them to 1d candle.
   * It will start downloading from the past.
   */
  async downloadLastCandle() {
    let minuteCandles: ICandlestick[] = [];

    const lastClosedCandleTimestamp = getLastClosedCandleTimestamp(this.bucketSize);
    let since = lastClosedCandleTimestamp;
    let done = false;

    logger.info(
      `[${this.symbol}#${this.timeframe}] Downloading ${this.symbol} ${this.timeframe} history candles from ${new Date(since).toISOString()}`,
    );

    while (!done) {
      const candles = await this.exchange.getCandlesticks({
        symbol: this.symbol,
        bar: BarSize.ONE_MINUTE,
        since,
      });

      const firstCandle = candles[0];
      const lastCandle = candles[candles.length - 1];
      logger.debug(
        `[${this.symbol}#${this.timeframe}] Fetched history candles ${firstCandle ? new Date(firstCandle.timestamp).toISOString() : null} to ${lastCandle ? new Date(lastCandle.timestamp).toISOString() : null}`,
      );

      minuteCandles = minuteCandles.concat(candles);

      if (candles.length === 0) {
        done = true;
        continue;
      }

      since = candles[candles.length - 1].timestamp + 60000;
    }

    const firstCandle = minuteCandles[0];
    const lastCandle = minuteCandles[minuteCandles.length - 1];
    logger.info(
      `[${this.symbol}#${this.timeframe}] Downloaded history candles from ${firstCandle ? new Date(firstCandle.timestamp).toISOString() : null} to ${lastCandle ? new Date(lastCandle.timestamp).toISOString() : null}`,
    );

    this.bucket = minuteCandles;

    while (this.bucket.length >= this.bucketSize + 1) {
      const candle = this.aggregate();
      this.candlesHistory.push(candle);
    }

    logger.info(
      {
        candlesHistory: this.candlesHistory.map((candle) => new Date(candle.timestamp).toISOString()),
        bucket: this.bucket.map((candle) => new Date(candle.timestamp).toISOString()),
      },
      `[${this.symbol}#${this.timeframe}] Download history candles completed`,
    );
  }

  async warmup(requiredHistory: number) {
    if (this.candlesHistory.length >= requiredHistory) {
      logger.info(`[${this.symbol}#${this.timeframe}] Already warmed up. Skipping.`);
      return;
    }

    const lastClosedCandleTimestamp = this.candlesHistory[this.candlesHistory.length - 1].timestamp;
    const since = lastClosedCandleTimestamp - 60000 * this.bucketSize * requiredHistory;
    let start = since;

    logger.info(
      `[${this.symbol}#${this.timeframe}] Warming up candles from ${new Date(since).toISOString()} to ${new Date(lastClosedCandleTimestamp).toISOString()}`,
    );

    let minuteCandles: ICandlestick[] = [];
    while (start <= lastClosedCandleTimestamp) {
      const candles = await this.exchange.getCandlesticks({
        symbol: this.symbol,
        bar: BarSize.ONE_MINUTE,
        since: start,
      });

      const firstCandle = candles[0];
      const lastCandle = candles[candles.length - 1];
      logger.debug(
        `[${this.symbol}#${this.timeframe}] Fetched candles from ${firstCandle ? new Date(firstCandle.timestamp).toISOString() : null} to ${lastCandle ? new Date(lastCandle.timestamp).toISOString() : null}`,
      );

      minuteCandles = minuteCandles.concat(candles);

      if (candles.length === 0) {
        continue;
      }

      start = candles[candles.length - 1].timestamp + 60000;
    }

    let firstCandle = minuteCandles[0];
    let lastCandle = minuteCandles[minuteCandles.length - 1];
    logger.info(
      `[${this.symbol}#${this.timeframe}] Downloaded candles from ${firstCandle ? new Date(firstCandle.timestamp).toISOString() : null} to ${lastCandle ? new Date(lastCandle.timestamp).toISOString() : null}`,
    );
    minuteCandles = minuteCandles.filter((candle) => candle.timestamp < lastClosedCandleTimestamp);

    firstCandle = minuteCandles[0];
    lastCandle = minuteCandles[minuteCandles.length - 1];
    logger.info(
      `[${this.symbol}#${this.timeframe}] Filtered candles from ${firstCandle ? new Date(firstCandle.timestamp).toISOString() : null} to ${lastCandle ? new Date(lastCandle.timestamp).toISOString() : null} (length: ${minuteCandles.length})`,
    );

    const aggregatedCandles: ICandlestick[] = [];
    while (minuteCandles.length >= this.bucketSize) {
      const candles = minuteCandles.splice(0, this.bucketSize);
      const candle = aggregateCandles(candles);
      aggregatedCandles.push(candle);
    }

    firstCandle = aggregatedCandles[0];
    lastCandle = aggregatedCandles[aggregatedCandles.length - 1];
    logger.info(
      `[${this.symbol}#${this.timeframe}] Warming up completed. Aggregated ${aggregatedCandles.length} candles from ${firstCandle ? new Date(firstCandle.timestamp).toISOString() : null} to ${lastCandle ? new Date(lastCandle.timestamp).toISOString() : null}`,
    );

    this.candlesHistory = [...aggregatedCandles, ...this.candlesHistory];
  }

  get symbol() {
    return this.candlesWatcher.symbol;
  }
}

function aggregateCandles(candles: ICandlestick[]) {
  return {
    open: candles[0].open,
    high: candles.reduce((acc, candle) => Math.max(acc, candle.high), 0),
    low: candles.reduce((acc, candle) => Math.min(acc, candle.low), Infinity),
    close: candles[candles.length - 1].close,
    timestamp: candles[0].timestamp,
  };
}

/**
 * Return the date of the last closed candle.
 *
 * @param bucketSize - Bucket size in minutes
 */
function getLastClosedCandleTimestamp(bucketSize: number) {
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);

  const minutes = now.getTime() / 60000;
  const bucketsLength = minutes % bucketSize;
  const timestamp = (minutes - bucketsLength - bucketSize) * 60000;

  return timestamp;
}
