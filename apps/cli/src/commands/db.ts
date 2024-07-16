import { Argument, Command } from "commander";
import { handle } from "../utils/command.js";
import { db } from "../api/db.js";

export function dbCommands(program: Command) {
  program
    .command("db")
    .description("Database operations")
    .addArgument(new Argument("<operation>", "Operation"))
    .action(handle(db));
}
