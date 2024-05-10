import { Command } from "commander";
import { addStopCommand } from "./commands/stop";
import { addBacktestCommand } from "./commands/backtest";
import { addGridLinesCommand } from "./commands/grid-lines";
import { addTradeCommand } from "./commands/trade";

const program = new Command();

program
  .name("@opentrader/cli")
  .description("CLI for OpenTrader")
  .version("0.0.1");

addBacktestCommand(program);
addGridLinesCommand(program);
addTradeCommand(program);
addStopCommand(program);

program.parse();
