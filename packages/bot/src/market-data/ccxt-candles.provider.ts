import { EventEmitter } from "node:events";
import { type Exchange, type OHLCV } from "ccxt";
import type { BarSize, ICandlestick } from "@opentrader/types";
import type { ICandlesProvider } from "./candles-provider.interface";
import { logger, format } from "@opentrader/logger";

export class CCXTCandlesProvider
  extends EventEmitter
  implements ICandlesProvider
{
  // Required for typing arguments in the `on` method
  // when using the instance of this class
  // ESLint doesn't like this
  // @todo move to the interface
  // emit(event: "start"): boolean;
  // emit(event: "done"): boolean;
  // emit(event: "candle", candle: ICandlestick): boolean;
  // emit(event: string | symbol, ...args: any[]): boolean {
  //   return super.emit(event, ...args);
  // }
  // on(event: "start", listener: () => void): this;
  // on(event: "done", listener: () => void): this;
  // on(event: "candle", listener: (candle: ICandlestick) => void): this;
  // on(event: string | symbol, listener: (...args: any[]) => void): this {
  //   return super.on(event, listener);
  // }

  /**
   * Instance of CCXT exchange
   */
  private exchange: Exchange;

  /**
   * Start date to fetch candles from
   */
  private startDate: Date;

  /**
   * End date to fetch candles to
   */
  private endDate: Date;

  /**
   * Timestamp of the last candle fetched
   */
  private since: number;

  /**
   * Symbol to fetch candles for
   */
  private symbol: string;

  /**
   * Timeframe to fetch candles for
   */
  private timeframe: BarSize;

  constructor({
    exchange,
    symbol,
    timeframe,
    startDate,
    endDate,
  }: {
    exchange: Exchange;
    symbol: string;
    timeframe: BarSize;
    startDate: Date;
    endDate: Date;
  }) {
    super();
    this.exchange = exchange;
    this.symbol = symbol;
    this.timeframe = timeframe;
    this.startDate = startDate;
    this.endDate = endDate;
    this.since = startDate.getTime();

    this.on("start", () => {
      logger.info(
        `Start fetching ${this.symbol} candles from ${format.datetime(startDate)} to ${format.datetime(endDate)}`,
      );
      void this.start();
    });
  }

  async start() {
    const data = await this.exchange.fetchOHLCV(
      this.symbol,
      this.timeframe,
      this.since,
    );
    const candles = data.map(normalizeCandle);

    const filteredCandles = candles.filter((candle) => {
      return (
        candle.timestamp >= this.startDate.getTime() &&
        candle.timestamp <= this.endDate.getTime()
      );
    });

    if (filteredCandles.length === 0) {
      logger.debug("No more candles");
      this.emit("done");
      return;
    }

    const firstCandle = filteredCandles[0];
    const lastCandle = filteredCandles[filteredCandles.length - 1];
    logger.info(
      `Fetched ${filteredCandles.length} candles from ${format.datetime(firstCandle.timestamp)} to ${format.datetime(lastCandle.timestamp)}`,
    );

    filteredCandles.forEach((candle) => {
      this.emit("candle", candle);
    });

    this.since = lastCandle.timestamp + 60000;

    if (this.since >= this.endDate.getTime()) {
      logger.debug("Reached the end");
      this.emit("done");
      return;
    }

    void this.start();
  }
}

/**
 * Normalize CCXT candle to unified format
 * @param candle - CCXT candle
 * @returns Normalized candle
 */
const normalizeCandle = (candle: OHLCV): ICandlestick => ({
  timestamp: candle[0]!,
  open: candle[1]!,
  high: candle[2]!,
  low: candle[3]!,
  close: candle[4]!,
});
