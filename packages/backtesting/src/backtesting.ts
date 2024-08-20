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
import type { IBotConfiguration, StrategyRunner, BotTemplate, BotState } from "@opentrader/bot-processor";
import { createStrategyRunner } from "@opentrader/bot-processor";
import type { ICandlestick } from "@opentrader/types";
import { logger, format } from "@opentrader/logger";
import { BacktestingReport } from "./backtesting-report.js";
import { MarketSimulator } from "./market-simulator.js";
import { MemoryExchange } from "./exchange/memory-exchange.js";
import { MemoryStore } from "./store/memory-store.js";

export class Backtesting<T extends IBotConfiguration<T>> {
  private marketSimulator: MarketSimulator;
  private store: MemoryStore;
  private exchange: MemoryExchange;
  private processor: StrategyRunner<T>;
  private botState: BotState = {};
  private botTemplate: BotTemplate<T>;
  private botConfig: T;

  constructor(options: { botConfig: T; botTemplate: BotTemplate<T> }) {
    const { botConfig, botTemplate } = options;

    this.marketSimulator = new MarketSimulator();
    this.store = new MemoryStore(this.marketSimulator);
    this.exchange = new MemoryExchange(this.marketSimulator);
    this.botTemplate = botTemplate;
    this.botConfig = botConfig;

    this.processor = createStrategyRunner({
      store: this.store,
      exchange: this.exchange,
      additionalExchanges: [], // @todo not supported yet
      botConfig,
      botTemplate,
    });
  }

  async run(candlesticks: ICandlestick[]): Promise<string> {
    for (const [index, candle] of candlesticks.entries()) {
      this.marketSimulator.nextCandle(candle);

      logger.info(`Process candle ${format.candletime(candle.timestamp)}: ${format.candle(candle)}`);

      // const anyOrderFulfilled = this.marketSimulator.fulfillOrders();

      // if (anyOrderFulfilled) {
      //   console.log("Fulfilled Table");
      //   console.table(fulfilledTable(this.store.getSmartTrades()));
      // }

      if (index === 0) {
        await this.processor.start(this.botState);
      } else if (index === candlesticks.length - 1) {
        // last candle
        await this.processor.stop(this.botState);
      } else {
        await this.processor.process(this.botState, undefined, {
          candle,
          candles: candlesticks.slice(0, index + 1),
        });
      }

      // const anyOrderPlaced = this.marketSimulator.placeOrders();
      // if (anyOrderPlaced) {
      //   console.log("Placed Table");
      //   console.table(gridTable(this.store.getSmartTrades()));
      // }
    }

    const report = new BacktestingReport(
      candlesticks,
      this.marketSimulator.smartTrades,
      this.botConfig,
      this.botTemplate,
    ).create();

    return report;
  }
}
