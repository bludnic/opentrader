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
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { BotTemplate } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

// Storage for saving custom strategies
export const customStrategies: Record<string, BotTemplate<any>> = {};

/**
 * Every file should default export a strategy function.
 *
 * @param path Absolute path from where to load custom strategies
 */
export async function loadCustomStrategies(path: string) {
  let files: string[] = [];

  try {
    files = await readdir(path);
  } catch (error) {
    logger.warn(
      `Failed to load custom strategies from path "${path}". Ensure the directory exists. Error: ${(error as Error).message}`,
    );
  }

  for (const file of files) {
    if (!file.endsWith(".mjs")) {
      logger.warn(`Skipping file "${file}" because it is not an ES Module. Use .mjs extension instead.`);
      continue;
    }

    const strategyName = file.replace(/\.mjs$/, "");
    const { default: strategy } = (await import(join(path, file))) as { default: BotTemplate<any> };

    customStrategies[strategyName] = strategy;
    logger.info(`Loaded custom strategy "${strategy.displayName || strategy.name}" from file "${file}"`);
  }

  return customStrategies;
}
