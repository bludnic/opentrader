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
import type { BotTemplate } from "@opentrader/bot-processor";
import * as templates from "../templates/index.js";
import { customStrategies } from "./custom-strategies.js";

function strategiesNames(strategies: Record<string, BotTemplate<any>>) {
  return Object.keys(strategies).join(", ");
}

type FindStrategyResult = {
  strategyFn: BotTemplate<any>;
  isCustom: boolean;
};

/**
 * Returns a strategy function based on the provided strategy name.
 * It could be a predefined strategy or a custom strategy from a file.
 * @param strategyName
 * @returns
 */
export function findStrategy(strategyName: string): FindStrategyResult {
  const predefinedStrategyFn = templates[strategyName as keyof typeof templates];
  const customStrategyFn = customStrategies[strategyName];
  const strategyFn = predefinedStrategyFn || customStrategyFn;

  if (!strategyFn) {
    throw new Error(
      `Strategy "${strategyFn}" does not exists. Use one of predefined strategies: ${strategiesNames(templates)}, or custom strategies: ${strategiesNames(customStrategies) || "<NO STRATEGIES>"}.`,
    );
  }

  return {
    strategyFn,
    isCustom: !!customStrategyFn,
  };
}

export * from "./custom-strategies.js";
