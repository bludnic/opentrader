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
        where: {
          id: botId,
        },
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
        where: {
          id: botId,
        },
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
