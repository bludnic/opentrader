import { ExchangeCode } from "@opentrader/types";
import type { Command } from "commander";
import { Argument, Option } from "commander";
import { DEFAULT_CONFIG_NAME } from "../config";
import { validateExchange, validatePair } from "../utils/validate";
import { handle } from "../utils/command";
import * as api from "../api";

export function addBacktestCommand(program: Command) {
  program
    .command("backtest")
    .description("Backtesting a strategy")
    .addArgument(new Argument("<strategy>", "Strategy name"))
    .addOption(
      new Option("-f, --from <from>", "Start date")
        .argParser((dateISO) => new Date(dateISO))
        .default(new Date("2024-01-01")),
    )
    .addOption(
      new Option("-t, --to <to>", "End date")
        .argParser((dateISO) => new Date(dateISO))
        .default(new Date("2024-01-07")),
    )
    .addOption(
      new Option("-p, --pair <pair>", "Trading pair").argParser(validatePair),
    )
    .addOption(
      new Option("-b, --timeframe <timeframe>", "Timeframe").default("1h"),
    )
    .addOption(
      new Option("-c, --config <config>", "Config file").default(
        DEFAULT_CONFIG_NAME,
      ),
    )
    .addOption(
      new Option("-e, --exchange <exchange>", "Exchange")
        .argParser(validateExchange)
        .default(ExchangeCode.OKX),
    )
    .action(handle(api.runBacktest));
}
