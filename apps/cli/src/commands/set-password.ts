import { Argument, Command } from "commander";
import { handle } from "../utils/command.js";
import { setPassword } from "../api/set-password.js";

export function setPasswordCommand(program: Command) {
  program
    .command("set-password")
    .description("Set admin password")
    .addArgument(new Argument("<password>", "New password"))
    .action(handle(setPassword));
}
