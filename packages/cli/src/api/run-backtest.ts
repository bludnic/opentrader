import { EventEmitter } from "node:events";
import { pro as ccxt, Exchange, OHLCV } from "ccxt";
import { templates } from "@opentrader/bot-templates";
import { Backtesting } from "@opentrader/backtesting";
import { logger } from "@opentrader/logger";
import { BarSize, ICandlestick } from "@opentrader/types";
import { CommandResult, ConfigName } from "../types";
import { readBotConfig } from "../config";
import { exchangeClassMap } from "../utils/ccxt";

export class CCXTCandleProvider extends EventEmitter {
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
      console.log(
        "CandleProvider: Start fetching candles from",
        this.startDate,
        "to",
        this.endDate,
      );
      void this.start();
    });
  }

  async start() {
    const candles = await this.exchange.fetchOHLCV(
      this.symbol,
      this.timeframe,
      this.since,
    );
    const filteredCandles = candles.filter((candle) => {
      return (
        candle[0] >= this.startDate.getTime() &&
        candle[0] <= this.endDate.getTime()
      );
    });

    if (filteredCandles.length === 0) {
      console.log("No more candles");
      this.emit("done");
      return;
    }

    const firstCandle = filteredCandles[0];
    const lastCandle = filteredCandles[filteredCandles.length - 1];
    console.log(
      "Fetched",
      filteredCandles.length,
      "candles from",
      new Date(firstCandle[0]).toISOString(),
      "to",
      new Date(lastCandle[0]).toISOString(),
    );

    filteredCandles.forEach((candle) => {
      this.emit("candle", candle);
    });

    this.since = lastCandle[0] + 60000;

    if (this.since >= this.endDate.getTime()) {
      console.log("Reached the end");
      this.emit("done");
      return;
    }

    this.start();
  }
}

export async function runBacktest(
  strategyName: keyof typeof templates,
  options: {
    config: ConfigName;
    from: Date;
    to: Date;
    timeframe: BarSize;
    symbol: string;
  },
): Promise<CommandResult> {
  const config = readBotConfig(options.config);
  logger.debug(config, "Parsed bot config");

  if (strategyName in templates === false) {
    const availableStrategies = Object.keys(templates).join(", ");
    logger.info(
      `Strategy "${strategyName}" does not exists. Available strategies: ${availableStrategies}`,
    );

    return {
      result: undefined,
    };
  }

  const ccxtExchange = exchangeClassMap[config.exchangeCode];
  const exchange = new ccxt[ccxtExchange]();

  const backtesting = new Backtesting({
    botConfig: config,
    botTemplate: templates[strategyName],
  });

  return new Promise((resolve, reject) => {
    const candles: ICandlestick[] = [];

    const candleProvider = new CCXTCandleProvider({
      exchange,
      symbol: options.symbol,
      timeframe: options.timeframe,
      startDate: options.from,
      endDate: options.to,
    });

    candleProvider.on("candle", (candle: OHLCV) => {
      candles.push({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
      });
    });

    candleProvider.on("done", async () => {
      console.log(`Fetched ${candles.length} candlesticks`);
      const report = await backtesting.run(candles);

      resolve({
        result: report,
      });
    });

    candleProvider.emit("start");
  });
}
