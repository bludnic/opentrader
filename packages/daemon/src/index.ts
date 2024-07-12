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
import { Server } from "node:http";
import { Processor } from "@opentrader/bot";
import { logger } from "@opentrader/logger";
import { eventBus, EVENT } from "@opentrader/trpc";
import { createServer } from "./server.js";
import { createProcessor } from "./processor.js";

export class Daemon {
  constructor(
    private processor: Processor,
    private server: Server,
  ) {
    eventBus.on(EVENT.onBotStarted, (bot) => {
      console.log("EventBus: Bot started", bot);
      void processor.onBotStarted(bot);
    });

    eventBus.on(EVENT.onExchangeAccountCreated, (exchangeAccount) => {
      console.log("EventBus: Exchange account created", exchangeAccount);
      void processor.addExchangeAccount(exchangeAccount);
    });

    eventBus.on(EVENT.onExchangeAccountDeleted, (exchangeAccount) => {
      console.log("EventBus: Exchange account deleted", exchangeAccount);
      void processor.removeExchangeAccount(exchangeAccount);
    });

    eventBus.on(EVENT.onExchangeAccountUpdated, (exchangeAccount) => {
      console.log("EventBus: Exchange account updated", exchangeAccount);
      void processor.updateExchangeAccount(exchangeAccount);
    });
  }

  static async create() {
    const processor = await createProcessor();
    logger.info("Processor created");

    const server = createServer().listen(8000);
    logger.info("RPC Server started on port 8000");

    return new Daemon(processor, server);
  }

  async restart() {
    await this.processor.beforeApplicationShutdown();

    this.processor = await createProcessor();
  }

  async shutdown() {
    logger.info("Shutting down Daemon...");

    this.server.close();
    logger.info("Express Server shutted down gracefully.");

    await this.processor.beforeApplicationShutdown();
    logger.info("Processor shutted down gracefully.");
  }
}
