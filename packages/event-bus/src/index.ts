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

import { ExchangeAccountWithCredentials, TBot, xprisma } from "@opentrader/db";
import { EventEmitter } from "node:events";

export const EVENT = {
  onExchangeAccountCreated: "onExchangeAccountCreated",
  onExchangeAccountDeleted: "onExchangeAccountDeleted",
  onExchangeAccountUpdated: "onExchangeAccountUpdated",
  onBotCreated: "onBotCreated",
  onBotStarted: "onBotStarted",
  onBotStopped: "onBotStopped",
} as const;

/**
 * Event bus between Backend and tRPC.
 *
 * Emits:
 * - `onExchangeAccountCreated: ExchangeAccountWithCredentials` - When an exchange account is created.
 * - `onBotCreated: TBot` - When a bot is created.
 */
class EventBus extends EventEmitter {
  exchangeAccountCreated(exchangeAccount: ExchangeAccountWithCredentials) {
    this.emit(EVENT.onExchangeAccountCreated, exchangeAccount);
  }

  exchangeAccountDeleted(exchangeAccount: ExchangeAccountWithCredentials) {
    this.emit(EVENT.onExchangeAccountDeleted, exchangeAccount);
  }

  exchangeAccountUpdated(exchangeAccount: ExchangeAccountWithCredentials) {
    this.emit(EVENT.onExchangeAccountUpdated, exchangeAccount);
  }

  botCreated(bot: TBot) {
    this.emit(EVENT.onBotCreated, bot);
  }

  botStarted(botId: number) {
    xprisma.bot
      .findUniqueOrThrow({
        where: { id: botId },
        include: { exchangeAccount: true },
      })
      .then((bot) => {
        this.emit(EVENT.onBotStarted, bot);
      })
      .catch((error) => {
        console.error("EventBus: Error in botStarted", error);
      });
  }

  botStopped(botId: number) {
    xprisma.bot
      .findUniqueOrThrow({
        where: { id: botId },
        include: { exchangeAccount: true },
      })
      .then((bot) => {
        this.emit(EVENT.onBotStopped, bot);
      })
      .catch((error) => {
        console.error("EventBus: Error in botStopped", error);
      });
  }
}

export const eventBus = new EventBus();
