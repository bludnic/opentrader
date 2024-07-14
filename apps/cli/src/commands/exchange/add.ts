import type { Command } from "commander";
import { Option } from "commander";
import { DEFAULT_CONFIG_NAME } from "../../config.js";
import { validateExchange } from "../../utils/validate.js";
import { handle } from "../../utils/command.js";
import { addExchangeAccount } from "../../api/exchanges/add.js";

export function addExchangeAccountCommand(program: Command) {
  program
    .command("exchange-add")
    .description("Add an exchange account")
    .addOption(
      new Option("-e, --code <code>", "Exchange code")
        .argParser(validateExchange)
        .makeOptionMandatory(true),
    )
    .addOption(
      new Option("-k, --key <key>", "API Key").makeOptionMandatory(true),
    )
    .addOption(new Option("-s, --secret <secret>", "Secret Key"))
    .addOption(
      new Option(
        "-p, --password <password>",
        "Password. Required for some exchanges",
      ).default(null),
    )
    .addOption(new Option("-d, --demo", "Is demo account?").default(false))
    .addOption(
      new Option("-l, --label <label>", "Exchange label").default("DEFAULT"),
    )
    .addOption(new Option("-n, --name <name>", "Exchange name").default(null))
    .addOption(new Option("-c, --config <config>", "Config file"))
    .action(handle(addExchangeAccount));
}
