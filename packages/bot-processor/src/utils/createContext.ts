import type { IExchange } from "@opentrader/exchanges";
import type { MarketData, MarketId, StrategyTriggerEventType } from "@opentrader/types";
import type { BotState, IBotConfiguration, IBotControl, TBotContext } from "../types/index.js";

export function createContext<T extends IBotConfiguration>(
  control: IBotControl,
  config: T,
  exchange: IExchange,
  command: "start" | "stop" | "process", // @todo add type in file
  state: BotState,
  market: MarketData = {
    candles: [],
  },
  markets: Record<MarketId, MarketData> = {},
  event?: StrategyTriggerEventType,
): TBotContext<T> {
  return {
    control,
    config,
    exchange,
    command,
    onStart: command === "start",
    onStop: command === "stop",
    onProcess: command === "process",
    state,
    market,
    markets,
    event,
  };
}
