import { describe, it, expect } from "vitest";
import { exchangeProvider } from "@opentrader/exchanges";
import { barSizeToDuration } from "@opentrader/tools";
import { BarSize, ExchangeCode, ICandlestick } from "@opentrader/types";
import { CandlesWatcher } from "./candles.watcher.js";
import { CandlesAggregator } from "./candles.aggregator.js";
import { logAggregatorState } from "./utils.js";

const ONE_MINUTE = barSizeToDuration(BarSize.ONE_MINUTE);
const FIVE_MINUTES = barSizeToDuration(BarSize.FIVE_MINUTES);

/**
 * Initializes an instance of `CandlesAggregator` with the given symbol and timeframe.
 */
const createAggregator = async (symbol: string, timeframe: BarSize) => {
  const exchange = exchangeProvider.fromCode(ExchangeCode.OKX);
  const watcher = new CandlesWatcher(symbol, exchange);

  const aggregator = new CandlesAggregator(timeframe, watcher, exchange);
  await aggregator.init();

  return { aggregator, exchange, watcher };
};

/**
 * Helper function to create a new candle with the given timestamp.
 * @param timestamp
 * @param ohlc
 */
const createCandle = (
  timestamp: Date | number,
  ohlc: Partial<Pick<ICandlestick, "open" | "high" | "low" | "close">> = {},
): ICandlestick => ({
  open: ohlc.open ?? 0,
  high: ohlc.high ?? 0,
  low: ohlc.low ?? 0,
  close: ohlc.close ?? 0,
  timestamp: new Date(timestamp).getTime(),
});

/**
 * Check if the difference between previous and next timestamp is exactly N minutes.
 * @param differenceInMs Difference in milliseconds between timestamps should be met.
 * @param candles List of candles to check.
 */
function areCandlesApart(differenceInMs: number, candles: ICandlestick[]) {
  return candles.slice(1).every((candle, index) => candle.timestamp - candles[index].timestamp === differenceInMs);
}

/**
 * Time difference between two candles.
 * @param leftCandle
 * @param rightCandle
 * @returns Difference in milliseconds.
 */
function timeDiff(leftCandle: ICandlestick, rightCandle: ICandlestick) {
  return rightCandle.timestamp - leftCandle.timestamp;
}

describe("CandlesAggregator", () => {
  it("should move 1m candles to the history", async () => {
    const { aggregator, watcher } = await createAggregator("BTC/USDT", BarSize.ONE_MINUTE);

    console.log("BEFORE");
    logAggregatorState(aggregator);

    const firstCandleInBucket = aggregator["bucket"].at(0)!;
    const lastCandleFromHistory = aggregator["candlesHistory"].at(-1)!;

    expect(aggregator["bucket"].length, "Wrong bucket length").toBe(1);
    expect(aggregator["candlesHistory"].length, "Initial candles history length is wrong").toBe(1);
    expect(
      firstCandleInBucket.timestamp - lastCandleFromHistory.timestamp,
      "The difference between first candle in the bucket and last candle in the history should be exactly one minute",
    ).toBe(ONE_MINUTE);

    const lastCandleInBucket = aggregator["bucket"].at(0)!;
    const lastCandleInBucketTime = new Date(lastCandleInBucket.timestamp);

    // After pushing a new candle to the bucket, the previous candle should be moved to the history
    watcher.emit("candle", createCandle(lastCandleInBucketTime.getTime() + ONE_MINUTE));
    expect(aggregator["bucket"].length, "Wrong bucket length").toBe(1);
    expect(aggregator["candlesHistory"].length, "Wrong candles history length").toBe(2);

    console.log("AFTER CANDLE 1");
    logAggregatorState(aggregator);

    watcher.emit("candle", createCandle(lastCandleInBucketTime.getTime() + 2 * ONE_MINUTE));
    expect(aggregator["candlesHistory"].length, "Wrong candles history length").toBe(3);
    expect(aggregator["bucket"].length, "Wrong bucket length").toBe(1);

    expect(
      areCandlesApart(ONE_MINUTE, aggregator["candlesHistory"]),
      "Candles in history should be 1 minute apart",
    ).toBe(true);
    expect(
      timeDiff(aggregator["candlesHistory"].at(-1)!, aggregator["bucket"].at(0)!),
      "The time difference between last history candle and first bucket candle should be 1m",
    ).toBe(ONE_MINUTE);

    expect(
      areCandlesApart(ONE_MINUTE, aggregator["candlesHistory"]),
      "Candles in history should be 1 minute apart",
    ).toBe(true);

    console.log("AFTER CANDLE 2");
    logAggregatorState(aggregator);
  });

  it("should aggregate 1m candles into 5m candles", async () => {
    const { aggregator, watcher } = await createAggregator("BTC/USDT", BarSize.FIVE_MINUTES);

    console.log("BEFORE");
    logAggregatorState(aggregator);

    const lastCandleInBucket = aggregator["bucket"].at(-1)!;
    const lastCandleInBucketTime = new Date(lastCandleInBucket.timestamp);

    // Pushing 100 x 1-minute candles to the bucket (approx. 20 x 5-minute candles)
    for (let i = 0; i < 100; i++) {
      watcher.emit("candle", createCandle(lastCandleInBucketTime.getTime() + i * ONE_MINUTE));
    }
    expect(
      areCandlesApart(FIVE_MINUTES, aggregator["candlesHistory"]),
      "Candles in history should be 5 minute apart",
    ).toBe(true);
    expect(
      timeDiff(aggregator["candlesHistory"].at(-1)!, aggregator["bucket"].at(0)!),
      "The time difference between last history candle and first bucket candle should be 5m",
    ).toBe(FIVE_MINUTES);

    console.log("AFTER");
    logAggregatorState(aggregator);
  });

  it("should update only OHLC price when a candle with same timestamp emitted", async () => {
    const { aggregator, watcher } = await createAggregator("BTC/USDT", BarSize.ONE_MINUTE);

    const { timestamp: lastCandleInBucketTimestamp } = aggregator["bucket"].at(-1)!;

    console.log("BEFORE");
    logAggregatorState(aggregator);

    const recentCandle = createCandle(lastCandleInBucketTimestamp, { open: 2, high: 4, low: 1, close: 3 });
    watcher.emit("candle", recentCandle);

    expect(aggregator["candlesHistory"].length, "History should remain unchanged").toBe(1);
    expect(aggregator["bucket"].length, "Wrong bucket length").toBe(1);
    expect(aggregator["bucket"].at(-1), "Only OHLC should be updated (timestamp remains the same)").toMatchObject({
      timestamp: lastCandleInBucketTimestamp,
      close: recentCandle.close, // checking only `close` price, because `open`, `high`, `low` may remain the same
    } as Partial<ICandlestick>);

    console.log("AFTER");
    logAggregatorState(aggregator);
  });

  it("should ignore candles with a timestamp older than the last candle in the bucket", async () => {
    const { aggregator, watcher } = await createAggregator("BTC/USDT", BarSize.ONE_MINUTE);

    const { timestamp: lastCandleInBucketTime, open, high, low, close } = aggregator["bucket"].at(-1)!;

    console.log("BEFORE");
    logAggregatorState(aggregator);

    watcher.emit("candle", createCandle(lastCandleInBucketTime - ONE_MINUTE));
    expect(aggregator["candlesHistory"].length, "History should remain unchanged").toBe(1);
    expect(aggregator["bucket"].length, "Wrong bucket length").toBe(1);
    expect(aggregator["bucket"].at(-1), "Last candle in the bucket should remain unchanged").toEqual({
      timestamp: lastCandleInBucketTime,
      open,
      high,
      low,
      close,
    } as ICandlestick);

    console.log("AFTER");
    logAggregatorState(aggregator);
  });

  it("should fill the gap between candles inside the bucket and then aggregate", async () => {
    const { aggregator, watcher } = await createAggregator("BTC/USDT", BarSize.ONE_MINUTE);

    const lastCandleInBucket = aggregator["bucket"].at(-1)!;
    const lastCandleInBucketTime = new Date(lastCandleInBucket.timestamp);

    console.log("BEFORE");
    logAggregatorState(aggregator);

    // creating a gap by skipping one minute
    const recentCandle = createCandle(new Date(lastCandleInBucketTime.getTime() + 2 * ONE_MINUTE));
    watcher.emit("candle", recentCandle);

    expect(aggregator["candlesHistory"].length, "Wrong candles history length").toBe(3); // 1 from history + 1 gap + 1 recent candle
    expect(aggregator["bucket"].length, "Should remain the same").toBe(1);
    expect(aggregator["bucket"].at(-1)!.timestamp, "Recent candle should be pushed to the bucket").toBe(
      recentCandle.timestamp,
    );

    console.log("AFTER");
    logAggregatorState(aggregator);
  });

  it("should fill a huge gap between candles inside the bucket and then aggregate continuously until bucket is empty", async () => {
    const { aggregator, watcher } = await createAggregator("BTC/USDT", BarSize.ONE_MINUTE);

    const lastCandleInBucket = aggregator["bucket"].at(-1)!;
    const lastCandleInBucketTime = new Date(lastCandleInBucket.timestamp);

    console.log("BEFORE");
    logAggregatorState(aggregator);

    // Creating a gap of 100-minutes candles
    const recentCandle = new Date(
      lastCandleInBucketTime.getTime() + 101 * ONE_MINUTE, // gap of 100-minute candles
    );
    watcher.emit("candle", createCandle(recentCandle));

    expect(aggregator["bucket"].length, "Should remain the same").toBe(1);
    expect(aggregator["bucket"].at(-1)!.timestamp, "Recent candle should be pushed to the bucket").toBe(
      recentCandle.getTime(),
    );
    expect(aggregator["candlesHistory"].length, "Wrong candles history length").toBe(1 + 101); // 1 from history + 100 gaps + 1 recent candle

    expect(
      areCandlesApart(ONE_MINUTE, aggregator["candlesHistory"]),
      "Candles in history should be 1 minute apart",
    ).toBe(true);
    expect(
      timeDiff(aggregator["candlesHistory"].at(-1)!, aggregator["bucket"].at(0)!),
      "The time difference between last history candle and first bucket candle should be 1m",
    ).toBe(ONE_MINUTE);

    console.log("AFTER");
    logAggregatorState(aggregator);
  });
});
