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
import { Command } from "commander";
import { addStopCommand } from "./commands/stop";
import { addBacktestCommand } from "./commands/backtest";
import { addGridLinesCommand } from "./commands/grid-lines";
import { addTradeCommand } from "./commands/trade";

const program = new Command();

program
  .name("@opentrader/cli")
  .description("CLI for OpenTrader")
  .version("0.0.1");

addBacktestCommand(program);
addGridLinesCommand(program);
addTradeCommand(program);
addStopCommand(program);

program.parse();
