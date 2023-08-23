import {
  IBotConfiguration,
  BotProcessor,
  BotManager,
  BotTemplate,
} from "@bifrost/bot-processor";
import { ICandlestick } from "@bifrost/types";
import { BacktestingReport } from "./backtesting-report";
import { ReportResult } from "./types";

import { MarketSimulator } from "./market-simulator";
import { MemoryExchange } from "./exchange/memory-exchange";
import { MemoryStore } from "./store/memory-store";

export class Backtesting<T extends IBotConfiguration> {
  private marketSimulator: MarketSimulator;
  private store: MemoryStore;
  private exchange: MemoryExchange;
  private processor: BotManager<T>;

  constructor(botConfig: T) {
    this.marketSimulator = new MarketSimulator();
    this.store = new MemoryStore(this.marketSimulator);
    this.exchange = new MemoryExchange(this.marketSimulator);

    this.processor = BotProcessor.create(botConfig, this.store, this.exchange);
  }

  async run(
    template: BotTemplate<T>,
    candlesticks: ICandlestick[]
  ): Promise<ReportResult> {
    for (const [index, candle] of candlesticks.entries()) {
      this.marketSimulator.nextCandle(candle);

      const candleDateString = new Date(candle.timestamp).toUTCString();

      console.log(
        `Candle ${candleDateString} (#${index} of ${candlesticks.length})`,
        candle.close
      );
      await this.processor.process(template);

      this.marketSimulator.processOrders();
    }

    const report = new BacktestingReport(
      this.marketSimulator.smartTrades
    ).create();

    return report;
  }
}
