import type { Command } from "commander";
import { Option } from "commander";
import { handle } from "../utils/command.js";
import { stopCommand } from "../api/stop-command.js";

export function addStopCommand(program: Command) {
  program
    .command("stop")
    .description("Process stop command")
    .addOption(new Option("-c, --config <config>", "Config file"))
    .action(handle(stopCommand));
}
