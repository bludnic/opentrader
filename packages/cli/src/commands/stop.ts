import type { Command } from "commander";
import { Option } from "commander";
import { DEFAULT_CONFIG_NAME } from "../config";
import { handle } from "../utils/command";
import * as api from "../api";

export function addStopCommand(program: Command) {
  program
    .command("stop")
    .description("Process stop command")
    .addOption(
      new Option("-c, --config <config>", "Config file").default(
        DEFAULT_CONFIG_NAME,
      ),
    )
    .action(handle(api.stopCommand));
}
