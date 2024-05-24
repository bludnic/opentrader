import type { Command } from "commander";
import { Argument, Option } from "commander";
import { DEFAULT_CONFIG_NAME } from "../config";
import { validatePair, validateTimeframe } from "../utils/validate";
import { handle } from "../utils/command";
import * as api from "../api";

export function addTradeCommand(program: Command) {
  program
    .command("trade")
    .description("Live trading")
    .addArgument(new Argument("<strategy>", "Strategy name"))
    .addOption(
      new Option("-c, --config <config>", "Config file").default(
        DEFAULT_CONFIG_NAME,
      ),
    )
    .addOption(
      new Option("-p, --pair <pair>", "Trading pair").argParser(validatePair),
    )
    .addOption(new Option("-e, --exchange <exchange>", "Exchange account"))
    .addOption(
      new Option("-t, --timeframe <timeframe>", "Timeframe")
        .argParser(validateTimeframe)
        .default(null),
    )
    .action(handle(api.runTrading));
}
