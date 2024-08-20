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
import type { IExchange } from "@opentrader/exchanges";
import type { MarketData, MarketId, MarketEventType } from "@opentrader/types";
import { BotControl } from "./bot-control.js";
import { effectRunnerMap } from "./effect-runner.js";
import { isEffect } from "./effects/index.js";
import type { BotState, BotTemplate, IBotConfiguration, IBotControl, IStore, TBotContext } from "./types/index.js";
import { createContext } from "./utils/createContext.js";

export class StrategyRunner<T extends IBotConfiguration> {
  constructor(
    private control: IBotControl,
    private botConfig: T,
    private exchange: IExchange,
    private additionalExchanges: IExchange[],
    private botTemplate: BotTemplate<T>,
  ) {}

  async start(state: BotState) {
    const context = createContext(
      this.control,
      this.botConfig,
      this.exchange,
      this.additionalExchanges,
      "start",
      state,
    );

    await this.runTemplate(context);
  }

  async stop(state: BotState) {
    const context = createContext(this.control, this.botConfig, this.exchange, this.additionalExchanges, "stop", state);

    await this.runTemplate(context);
  }

  async process(
    state: BotState,
    event?: MarketEventType,
    market?: MarketData,
    markets: Record<MarketId, MarketData> = {},
  ) {
    const context = createContext(
      this.control,
      this.botConfig,
      this.exchange,
      this.additionalExchanges,
      "process",
      state,
      market,
      markets,
      event,
    );

    await this.runTemplate(context);
  }

  private async runTemplate(context: TBotContext<T>): Promise<void> {
    const generator = this.botTemplate(context);

    let item = generator.next();

    for (; !item.done; ) {
      if (item.value instanceof Promise) {
        const result = await item.value;

        item = generator.next(result);
      } else if (isEffect(item.value)) {
        const effect = item.value;
        const effectRunner = effectRunnerMap[effect.type];

        item = generator.next(await effectRunner(effect, context));
      } else {
        console.log(item.value);
        throw new Error("Unsupported effect");
      }
    }
  }
}

export function createStrategyRunner<T extends IBotConfiguration>(options: {
  store: IStore;
  exchange: IExchange;
  additionalExchanges: IExchange[];
  botConfig: T;
  botTemplate: BotTemplate<T>;
}) {
  const { botConfig, store, exchange, additionalExchanges, botTemplate } = options;

  const botControl = new BotControl(store, botConfig);

  return new StrategyRunner(botControl, botConfig, exchange, additionalExchanges, botTemplate);
}
