import { EventEmitter } from "node:events";
import type { IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { barSizeToDuration } from "@opentrader/tools";
import { BarSize } from "@opentrader/types";
import type { ICandlestick } from "@opentrader/types";
import type { CandlesWatcher } from "./candles.watcher";

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

  constructor(
    timeframe: BarSize,
    candlesWatcher: CandlesWatcher,
    exchange: IExchange,
  ) {
    super();

    this.exchange = exchange;
    this.timeframe = timeframe;
    this.bucketSize = barSizeToDuration(timeframe) / 60000; // convert ms to minutes
    this.candlesWatcher = candlesWatcher;

    this.candlesWatcher.on("candle", this.handleCandle.bind(this));
  }

  private handleCandle(candle: ICandlestick) {
    if (!this.enabled) {
      console.log("Waiting until initialized");
      return;
    }

    // The `this.bucketSize + 1` is used to confirm that the last candle has fully closed
    // before proceeding with aggregation.
    if (this.bucket.length >= this.bucketSize + 1) {
      const candle = this.aggregate();
      this.candlesHistory.push(candle);

      logger.info(
        candle,
        `[${this.symbol}#${this.timeframe}] Aggregated candle: O: ${candle.open}, H: ${candle.high}, L: ${candle.low}, C: ${candle.close} at ${new Date(candle.timestamp).toISOString()}`,
      );
      this.emit("candle", candle, this.candlesHistory);

      return;
    }

    logger.info(
      `[${this.symbol}#${this.timeframe}] Bucket length is ${this.bucket.length}/${this.bucketSize}`,
    );

    const lastCandle = this.bucket[this.bucket.length - 1];
    if (candle.timestamp < lastCandle?.timestamp) {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Candle timestamp ${new Date(candle.timestamp).toISOString()} is older than last candle (${new Date(lastCandle.timestamp).toISOString()}) in the bucket. Skipping.`,
      );

      return;
    }

    if (candle.timestamp === lastCandle?.timestamp) {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Updated OHLCV of ${new Date(candle.timestamp).toISOString()} candle`,
      );
      lastCandle.open = candle.open;
      lastCandle.high = Math.max(candle.high, lastCandle.high);
      lastCandle.low = Math.min(candle.low, lastCandle.low);
      lastCandle.close = candle.close;

      return;
    }

    const lastTimestamp = this.bucket[this.bucket.length - 1]?.timestamp;
    if (lastTimestamp && candle.timestamp !== lastTimestamp + 60000) {
      const expectedNextTimestamp = lastTimestamp + 60000;

      logger.error(
        `[${this.symbol}#${this.timeframe}] candle timestamp ${new Date(candle.timestamp).toISOString()} is not equal to expected next timestamp ${new Date(expectedNextTimestamp).toISOString()}. There is a gap in the data.`,
      );
      throw new Error("Not implemented"); // @todo fill gaps
    }

    const isFirstCandle = candle.timestamp % (this.bucketSize * 60000) === 0;
    if (this.bucket.length > 0 || isFirstCandle) {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Pushed ${this.symbol} ${isFirstCandle ? "first " : ""}candle ${new Date(candle.timestamp).toISOString()} to the bucket (length: ${this.bucket.length})`,
      );

      this.bucket.push(candle);
    } else {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Candle ${new Date(candle.timestamp).toISOString()} is not divisible by ${this.timeframe} bucket. Skipping.`,
      );
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

  /**
   * Download and aggregated last closed candle.
   */
  async downloadLastCandle() {
    let minuteCandles: ICandlestick[] = [];

    const lastClosedCandleTimestamp = getLastClosedCandleTimestamp(
      this.bucketSize,
    );
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
        candlesHistory: this.candlesHistory.map((candle) =>
          new Date(candle.timestamp).toISOString(),
        ),
        bucket: this.bucket.map((candle) =>
          new Date(candle.timestamp).toISOString(),
        ),
      },
      `[${this.symbol}#${this.timeframe}] Download history candles completed`,
    );

    this.enabled = true;
  }

  async warmup(requiredHistory: number) {
    if (this.candlesHistory.length >= requiredHistory) {
      logger.info(
        `[${this.symbol}#${this.timeframe}] Already warmed up. Skipping.`,
      );
      return;
    }

    const lastClosedCandleTimestamp =
      this.candlesHistory[this.candlesHistory.length - 1].timestamp;
    const since =
      lastClosedCandleTimestamp - 60000 * this.bucketSize * requiredHistory;
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
    minuteCandles = minuteCandles.filter(
      (candle) => candle.timestamp < lastClosedCandleTimestamp,
    );

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
