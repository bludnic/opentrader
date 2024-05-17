import { EventEmitter } from "node:events";
import { logger } from "@opentrader/logger";
import { barSizeToDuration } from "@opentrader/tools";
import type { BarSize, ICandlestick } from "@opentrader/types";
import type { CandlesWatcher } from "./candles.watcher";

/**
 * Aggregates 1m candles to higher timeframes.
 *
 * Emits:
 * - candle(lastCandle: `ICandlestick`, candlesHistory: ICandlestick[]): void
 */
export class CandlesAggregator extends EventEmitter {
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

  constructor(timeframe: BarSize, candlesWatcher: CandlesWatcher) {
    super();

    this.timeframe = timeframe;
    this.bucketSize = barSizeToDuration(timeframe) / 60000; // convert ms to minutes
    this.candlesWatcher = candlesWatcher;

    this.candlesWatcher.on("candle", (candle: ICandlestick) => {
      // The `this.bucketSize + 1` is used to confirm that the last candle has fully closed
      // before proceeding with aggregation.
      if (this.bucket.length >= this.bucketSize + 1) {
        logger.info(
          this.bucket,
          `Bucket length of ${this.symbol} reached ${this.bucket.length}/${this.bucketSize}. Aggregating ${this.timeframe} bucket`,
        );
        const candle = this.aggregate();
        this.candlesHistory.push(candle);

        logger.info(
          candle,
          `Aggregated ${this.symbol} ${this.bucketSize}m candles to ${this.timeframe}: O: ${candle.open}, H: ${candle.high}, L: ${candle.low}, C: ${candle.close} at ${new Date(candle.timestamp).toISOString()}`,
        );
        this.emit("candle", candle, this.candlesHistory);

        return;
      }

      logger.info(
        `Bucket length of ${this.symbol} is ${this.bucket.length}, waiting until reaches ${this.bucketSize}(+1). Skip aggregation.`,
      );

      const lastCandle = this.bucket[this.bucket.length - 1];
      if (candle.timestamp < lastCandle?.timestamp) {
        logger.info(
          `${this.symbol} candle timestamp ${new Date(candle.timestamp).toISOString()} is older than last candle (${new Date(lastCandle.timestamp).toISOString()}) in the bucket. Skipping.`,
        );

        return;
      }

      if (candle.timestamp === lastCandle?.timestamp) {
        logger.info(
          `${this.symbol} candle timestamp ${new Date(candle.timestamp).toISOString()} is equal to last candle (${new Date(lastCandle.timestamp).toISOString()}) in the bucket. Updating OHLCV data.`,
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
          `${this.symbol} candle timestamp ${new Date(candle.timestamp).toISOString()} is not equal to expected next timestamp ${new Date(expectedNextTimestamp).toISOString()}. There is a gap in the data.`,
        );
        throw new Error("Not implemented"); // @todo fill gaps
      }

      const isFirstCandle = candle.timestamp % (this.bucketSize * 60000) === 0;
      if (this.bucket.length > 0 || isFirstCandle) {
        logger.info(
          `Pushed ${this.symbol} ${isFirstCandle ? "first " : ""}candle ${new Date(candle.timestamp).toISOString()} to ${this.timeframe} bucket (length: ${this.bucket.length}).`,
        );

        this.bucket.push(candle);
      } else {
        logger.info(
          `${this.symbol} candle ${new Date(candle.timestamp).toISOString()} is not divisible by ${this.timeframe} bucket. Skipping.`,
        );
      }
    });
  }

  private aggregate(): ICandlestick {
    const candles = this.bucket.splice(0, this.bucketSize);

    return {
      open: candles[0].open,
      high: candles.reduce((acc, candle) => Math.max(acc, candle.high), 0),
      low: candles.reduce((acc, candle) => Math.min(acc, candle.low), Infinity),
      close: candles[candles.length - 1].close,
      timestamp: candles[candles.length - 1].timestamp,
    };
  }

  get symbol() {
    return this.candlesWatcher.symbol;
  }
}
