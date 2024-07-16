import { join } from "node:path";
import type { BotTemplate } from "@opentrader/bot-processor";
import * as templates from "../templates/index.js";

type FindStrategyResult = {
  strategyFn: BotTemplate<any>;
  isCustom: boolean;
  strategyFilePath: string; // empty string if not a custom strategy
};

export async function findStrategy(
  strategyNameOrFile: string,
): Promise<FindStrategyResult> {
  let strategyFn;

  const isCustomStrategyFile = strategyNameOrFile.endsWith(".mjs");
  const customStrategyFilePath = strategyNameOrFile.startsWith("/")
    ? strategyNameOrFile
    : join(process.cwd(), strategyNameOrFile);

  const strategyExists = strategyNameOrFile in templates;
  console.log(`Strategy file: ${customStrategyFilePath}`);

  if (isCustomStrategyFile) {
    const { default: fn } = await import(customStrategyFilePath);
    strategyFn = fn;
  } else if (strategyExists) {
    strategyFn = templates[strategyNameOrFile as keyof typeof templates];
  } else {
    throw new Error(
      `Strategy "${strategyNameOrFile}" does not exists. Use one of predefined strategies: ${Object.keys(
        templates,
      ).join(", ")}, or specify the path to custom strategy file.`,
    );
  }

  return {
    strategyFn,
    isCustom: isCustomStrategyFile,
    strategyFilePath: isCustomStrategyFile ? customStrategyFilePath : "",
  };
}
