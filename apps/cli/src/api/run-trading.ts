import { templates } from "@opentrader/bot-templates";
import { BarSize } from "@opentrader/types";
import { Client } from "jayson/promise";
import type { CommandResult, ConfigName } from "../types.js";

type Options = {
  config: ConfigName;
  pair?: string;
  exchange?: string;
  timeframe?: BarSize;
};

export async function runTrading(
  strategyName: keyof typeof templates,
  options: Options,
): Promise<CommandResult> {
  const client = Client.http({
    port: 8000,
  });

  const result = client.request("startBot", [
    strategyName,
    options.config,
    options.pair,
    options.exchange,
    options.timeframe,
  ]);

  return {
    result: undefined,
  };
}
