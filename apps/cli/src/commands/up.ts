import { Command, Option } from "commander";
import { handle } from "../utils/command.js";
import { up } from "../api/up/index.js";

export function addUpCommand(program: Command) {
  program
    .command("up")
    .addOption(new Option("-d, --detach", "Run in detached mode").default(false))
    .addOption(new Option("--strategies-dir <strategiesDir>", "Path to strategies directory"))
    .action(handle(up));
}
