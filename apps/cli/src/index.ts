/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */

import { logPath } from "./utils/app-path.js";
process.env.LOG_FILE = logPath;

import { Command } from "commander";
import packageJSON from "../package.json";
import { setPasswordCommand } from "./commands/set-password.js";
import { addExchangeAccountCommand } from "./commands/exchange/add.js";
import { updateExchangeAccountCommand } from "./commands/exchange/update.js";
import { addStopCommand } from "./commands/stop.js";
import { addBacktestCommand } from "./commands/backtest.js";
import { addGridLinesCommand } from "./commands/grid-lines.js";
import { addTradeCommand } from "./commands/trade.js";
import { addUpCommand } from "./commands/up.js";
import { addDownCommand } from "./commands/down.js";
import { dbCommands } from "./commands/db.js";
import { addLogsCommand } from "./commands/logs.js";

const program = new Command();

program
  .name("@opentrader/cli")
  .description("CLI for OpenTrader")
  .version(packageJSON.version, "-v, --version", "Output the OpenTrader version");

setPasswordCommand(program);
addExchangeAccountCommand(program);
updateExchangeAccountCommand(program);
addBacktestCommand(program);
addGridLinesCommand(program);
addTradeCommand(program);
addStopCommand(program);
addUpCommand(program);
addDownCommand(program);
dbCommands(program);
addLogsCommand(program);

program.parse();

export * from "@opentrader/bot-processor";
