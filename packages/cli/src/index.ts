import { Argument, Command, Option } from "commander";
import { addBacktestCommand } from "./commands/backtest";
import { addGridLinesCommand } from "./commands/grid-lines";

const program = new Command();

program
  .name("@opentrader/cli")
  .description("CLI for OpenTrader")
  .version("0.0.1");

addBacktestCommand(program);
addGridLinesCommand(program);

program.parse();
