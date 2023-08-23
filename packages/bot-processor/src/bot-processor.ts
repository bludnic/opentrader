import { IExchange } from "@bifrost/exchanges";
import { BotControl } from "./bot-control";
import { BotManager } from "./bot-manager";
import { IBotConfiguration } from "./types/bot/bot-configuration.interface";
import { IStore } from "./types/store/store.interface";

export class BotProcessor {
  static create<T extends IBotConfiguration>(
    botConfig: T,
    store: IStore,
    exchange: IExchange
  ) {
    const botControl = new BotControl(store, botConfig);
    const manager = new BotManager(botControl, exchange);

    return manager;
  }
}
