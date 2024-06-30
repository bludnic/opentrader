import type { Command } from "commander";
import { Argument, Option } from "commander";
import { handle } from "../utils/command.js";
import { buildGridLines } from "../api/grid-lines.js";

export function addGridLinesCommand(program: Command) {
  program
    .command("grid-lines")
    .description("Build grid lines by given parameters")
    .addArgument(new Argument("<max>", "Max price").argParser(parseFloat))
    .addArgument(new Argument("<min>", "Min price").argParser(parseFloat))
    .addOption(
      new Option("-l, --lines <lines>", "Number of lines")
        .argParser(parseFloat)
        .default(10),
    )
    .addOption(
      new Option("-q, --quantity <quantity>", "Quantity")
        .argParser(parseFloat)
        .default(1),
    )
    .action(handle(buildGridLines));
}
