import { ExchangeAccountWithCredentials, TBot } from "@opentrader/db";
import { EventEmitter } from "node:events";

export const EVENT = {
  onExchangeAccountCreated: "onExchangeAccountCreated",
  onBotCreated: "onBotCreated",
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

  botCreated(bot: TBot) {
    this.emit(EVENT.onBotCreated, bot);
  }
}

export const eventBus = new EventBus();
