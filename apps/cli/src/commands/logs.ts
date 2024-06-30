import { Command, Option } from "commander";
import { handle } from "../utils/command.js";
import { logs } from "../api/logs.js";

export function addLogsCommand(program: Command) {
  program
    .command("logs")
    .addOption(new Option("-f, --follow", "Follow logs").default(false))
    .action(handle(logs));
}
