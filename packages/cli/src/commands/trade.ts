import { Argument, Command, Option } from "commander";
import { handle } from "../utils/command";
import * as api from "../api";

export function addTradeCommand(program: Command) {
  program
    .command("trade")
    .description("Live trading")
    .addArgument(new Argument("<strategy>", "Strategy name"))
    .addOption(
      new Option("-c, --config <config>", "Config file").default("default"),
    )
    .action(handle(api.runTrading));
}
