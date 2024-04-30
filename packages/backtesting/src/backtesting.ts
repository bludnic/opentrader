import type {
  IBotConfiguration,
  BotManager,
  BotTemplate,
} from "@opentrader/bot-processor";
import { BotProcessor } from "@opentrader/bot-processor";
import type { ICandlestick } from "@opentrader/types";
import { fulfilledTable, gridTable } from "./debugging";
import { BacktestingReport } from "./backtesting-report";
import type { ReportResult } from "./types";
import { MarketSimulator } from "./market-simulator";
import { MemoryExchange } from "./exchange/memory-exchange";
import { MemoryStore } from "./store/memory-store";
import { logger, format } from "@opentrader/logger";

export class Backtesting<T extends IBotConfiguration<T>> {
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

      logger.info(
        `Process candle ${format.candletime(candle.timestamp)}: ${format.candle(
          candle,
        )}`,
      );

      const anyOrderFulfilled = this.marketSimulator.fulfillOrders();

      if (anyOrderFulfilled) {
        console.log("Fulfilled Table");
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
        console.log("Placed Table");
        console.table(gridTable(this.store.getSmartTrades()));
      }
    }

    const report = new BacktestingReport(
      this.marketSimulator.smartTrades,
    ).create();

    return report;
  }
}
