import {
  IBotConfiguration,
  BotProcessor,
  BotManager,
  BotTemplate,
} from "@bifrost/bot-processor";
import { ICandlestick } from "@bifrost/types";
import { fulfilledTable, gridTable } from "./debugging";
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

  constructor(options: { botConfig: T; botTemplate: BotTemplate<T> }) {
    const { botConfig, botTemplate } = options;

    this.marketSimulator = new MarketSimulator();
    this.store = new MemoryStore(this.marketSimulator);
    this.exchange = new MemoryExchange(this.marketSimulator);

    this.processor = BotProcessor.create({
      store: this.store,
      exchange: this.exchange,
      botConfig,
      botTemplate,
    });
  }

  async run(candlesticks: ICandlestick[]): Promise<ReportResult> {
    for (const [index, candle] of candlesticks.entries()) {
      this.marketSimulator.nextCandle(candle);

      const candleDateString = new Date(candle.timestamp)
        .toISOString()
        .slice(0, 10);
      console.log(
        `Process candle ${candleDateString} (#${index + 1} of ${
          candlesticks.length
        })`,
        candle.close,
      );

      const anyOrderFulfilled = this.marketSimulator.fulfillOrders();

      if (anyOrderFulfilled) {
        console.log('Fulfilled Table')
        console.table(fulfilledTable(this.store.getSmartTrades()));
      }

      if (index === 0) {
        await this.processor.start();
      } else if (index === candlesticks.length - 1) {
        // last candle
        await this.processor.stop();
      } else {
        await this.processor.process();
      }

      const anyOrderPlaced = this.marketSimulator.placeOrders();
      if (anyOrderPlaced) {
        console.log('Placed Table')
        console.table(gridTable(this.store.getSmartTrades()));
      }
    }

    const report = new BacktestingReport(
      this.marketSimulator.smartTrades,
    ).create();

    return report;
  }
}
