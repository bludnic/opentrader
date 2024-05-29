import { ExchangeAccountWithCredentials, TBot, xprisma } from "@opentrader/db";
import { EventEmitter } from "node:events";

export const EVENT = {
  onExchangeAccountCreated: "onExchangeAccountCreated",
  onBotCreated: "onBotCreated",
  onBotStarted: "onBotStarted",
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

  botStarted(botId: number) {
    xprisma.bot
      .findUniqueOrThrow({
        where: {
          id: botId,
        },
      })
      .then((bot) => {
        this.emit(EVENT.onBotStarted, bot);
      })
      .catch((error) => {
        console.error("EventBuss: Error in botStarted", error);
      });
  }
}

export const eventBus = new EventBus();
