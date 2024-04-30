import { Argument, Command, Option } from "commander";
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
      new Option("-s, --symbol <symbol>", "Symbol").default("BTC/USDT"),
    )
    .addOption(
      new Option("-b, --timeframe <timeframe>", "Timeframe").default("1h"),
    )
    .addOption(
      new Option("-c, --config <config>", "Config file").default("default"),
    )
    .action(handle(api.runBacktest));
}
