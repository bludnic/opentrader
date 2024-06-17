import { Command, Option } from "commander";
import { handle } from "../utils/command";
import { down } from "../api";

export function addDownCommand(program: Command) {
  program
    .command("down")
    .addOption(
      new Option("-f, --force", "Forcefully stop the daemon process").default(
        false,
      ),
    )
    .action(handle(down));
}
