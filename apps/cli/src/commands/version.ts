import { Command, Option } from "commander";
import { handle } from "../utils/command";
import { version } from "../api";

export function addVersionCommand(program: Command) {
  program.command("version").action(handle(version));
}
