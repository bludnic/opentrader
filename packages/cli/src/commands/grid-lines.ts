import { Argument, Command, Option } from "commander";
import { handle } from "../utils/command";
import * as api from "../api";

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
    .action(handle(api.buildGridLines));
}
