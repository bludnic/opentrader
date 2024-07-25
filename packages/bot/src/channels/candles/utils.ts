import { ICandlestick } from "@opentrader/types";
import { format } from "@opentrader/logger";
import { CandlesAggregator } from "./candles.aggregator.js";

/**
 * Log a list of candles in a human friendly format.
 * @param candles
 */
export function logCandles(candles: ICandlestick[]) {
  for (const candle of candles) {
    console.log(`  ${format.candletime(candle.timestamp)} --`, format.candle(candle));
  }
}

/**
 * Log the state of the aggregator in a human friendly format.
 * @param aggregator
 */
export function logAggregatorState(aggregator: CandlesAggregator) {
  console.log("History candles:");
  logCandles(aggregator["candlesHistory"]);

  console.log("Bucket candles:");
  logCandles(aggregator["bucket"]);

  console.log(""); // break line
}
