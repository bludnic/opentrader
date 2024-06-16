import { existsSync } from "node:fs";
import { join } from "node:path";
import type { BotTemplate } from "@opentrader/bot-processor";

import * as templates from "./templates";

export async function findStrategy(
  strategyNameOrFile: string,
): Promise<BotTemplate<any>> {
  let strategyFn;

  const isCustomStrategyFile = existsSync(
    join(process.cwd(), strategyNameOrFile),
  );

  const strategyExists = strategyNameOrFile in templates;

  if (isCustomStrategyFile) {
    const { default: fn } = await import(
      join(process.cwd(), strategyNameOrFile)
    );
    strategyFn = fn;
  } else if (strategyExists) {
    strategyFn = templates[strategyNameOrFile as keyof typeof templates];
  } else {
    throw new Error(
      `Strategy "${strategyNameOrFile}" does not exists. Use one of predefined strategies: ${Object.keys(
        templates,
      ).join(", ")}, or specify the path to the custom strategy file.`,
    );
  }

  return strategyFn;
}
