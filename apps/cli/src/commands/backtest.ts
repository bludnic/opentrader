import { ExchangeCode } from "@opentrader/types";
import type { Command } from "commander";
import { Argument, Option } from "commander";
import { validateExchange, validatePair } from "../utils/validate.js";
import { handle } from "../utils/command.js";
import { runBacktest } from "../api/run-backtest.js";

export function addBacktestCommand(program: Command) {
  program
    .command("backtest")
    .description("Backtesting a strategy")
    .addArgument(new Argument("<strategy>", "Strategy name"))
    .addOption(
      new Option("--from <from>", "Start date")
        .argParser((dateISO) => new Date(dateISO))
        .default(new Date("2024-03-01")),
    )
    .addOption(
      new Option("--to <to>", "End date").argParser((dateISO) => new Date(dateISO)).default(new Date("2024-03-31")),
    )
    .addOption(new Option("-p, --pair <pair>", "Trading pair").argParser(validatePair))
    .addOption(new Option("-t, --timeframe <timeframe>", "Timeframe").default("1h"))
    .addOption(new Option("-c, --config <config>", "Config file"))
    .addOption(
      new Option("-e, --exchange <exchange>", "Exchange").argParser(validateExchange).default(ExchangeCode.OKX),
    )
    .action(handle(runBacktest));
}
