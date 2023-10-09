import type { IExchange } from "@opentrader/exchanges";
import { BotControl } from "./bot-control";
import { BotManager } from "./bot-manager";
import { IBotConfiguration } from "./types/bot/bot-configuration.interface";
import { BotTemplate } from "./types/bot/bot-template.type";
import { IStore } from "./types/store/store.interface";

export class BotProcessor {
  static create<T extends IBotConfiguration>(options: {
    store: IStore;
    exchange: IExchange;
    botConfig: T;
    botTemplate: BotTemplate<T>;
  }) {
    const { botConfig, store, exchange, botTemplate } = options;

    const botControl = new BotControl(store, botConfig);
    const manager = new BotManager(
      botControl,
      botConfig,
      exchange,
      botTemplate,
    );

    return manager;
  }
}
