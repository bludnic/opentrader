import { Command, Option } from "commander";
import { handle } from "../utils/command.js";
import { version } from "../api/version.js";

export function addVersionCommand(program: Command) {
  program.command("version").action(handle(version));
}
