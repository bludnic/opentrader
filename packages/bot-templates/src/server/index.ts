import { join } from "node:path";
import type { BotTemplate } from "@opentrader/bot-processor";
import * as templates from "../templates/index.js";
import dynamicImport from "./dynamic-import.js";

type FindStrategyResult = {
  strategyFn: BotTemplate<any>;
  isCustom: boolean;
  strategyFilePath: string; // empty string if not a custom strategy
};

export async function findStrategy(
  strategyNameOrFile: string,
): Promise<FindStrategyResult> {
  let strategyFn;

  const isCustomStrategyFile = strategyNameOrFile.endsWith(".js");
  const customStrategyFilePath = strategyNameOrFile.startsWith("/")
    ? strategyNameOrFile
    : join(process.cwd(), strategyNameOrFile);

  const strategyExists = strategyNameOrFile in templates;

  if (isCustomStrategyFile) {
    strategyFn = dynamicImport(customStrategyFilePath);
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
