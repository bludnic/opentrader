import type { IExchange } from "@opentrader/exchanges";
import type { MarketData } from "../market";
import type { IBotControl } from "./bot-control.interface";
import type { IBotConfiguration } from "./bot-configuration.interface";
import type { BotState } from "./bot.state";

export type TBotContext<T extends IBotConfiguration> = {
  /**
   * Default exchange instance.
   */
  exchange: IExchange;
  /**
   * Bot control panel
   */
  control: IBotControl;
  /**
   * Bot configuration
   */
  config: T;
  /**
   * Bot's state
   */
  state: BotState;
  /**
   * Event
   */
  command: "start" | "stop" | "process";
  onStart: boolean;
  onStop: boolean;
  onProcess: boolean;
  /**
   * Marked data
   */
  market: MarketData;
};
