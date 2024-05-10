import { Argument, Command, Option } from "commander";
import { DEFAULT_CONFIG_NAME } from "../config";
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
    .action(handle(api.runTrading));
}
