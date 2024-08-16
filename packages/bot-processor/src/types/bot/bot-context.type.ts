import type { IExchange } from "@opentrader/exchanges";
import type { MarketData, StrategyTriggerEventType } from "@opentrader/types";
import type { IBotControl } from "./bot-control.interface.js";
import type { IBotConfiguration } from "./bot-configuration.interface.js";
import type { BotState } from "./bot.state.js";

export type TBotContext<T extends IBotConfiguration, S extends BotState = BotState> = {
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
  state: S;
  /**
   * Event
   */
  command: "start" | "stop" | "process";
  event?: StrategyTriggerEventType;
  onStart: boolean;
  onStop: boolean;
  onProcess: boolean;
  /**
   * Marked data
   */
  market: MarketData;
};
