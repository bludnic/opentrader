import * as api from './api'
import { Command } from "commander";

const program = new Command();

program
  .name("@opentrader/cli")
  .description("CLI for OpenTrader")
  .version("0.0.1");

program
  .command("backtest")
  .description("Backtesting a strategy")
  .argument("<strategy>", "Strategy name")
  .option("-c, --config <config>", "Config file", "config.json5")
  .action(async (strategy, options) => {
    const report = await api.runBacktest();

    return console.log(report)
  });

program.parse();

// const options = program.opts();
//
// console.log("options:", options);
// console.log("args", program.args);
