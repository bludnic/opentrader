import type { IExchange } from "@opentrader/exchanges";
import type { MarketData, MarketId, MarketEventType } from "@opentrader/types";
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
  event?: MarketEventType;
  onStart: boolean;
  onStop: boolean;
  onProcess: boolean;
  /**
   * Default market from `bot.symbol`
   */
  market: MarketData;
  /**
   * Additional markets
   */
  markets: Record<MarketId, MarketData>;
};
