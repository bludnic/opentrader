import type { IExchange } from "@opentrader/exchanges";
import type {
  BotState,
  IBotConfiguration,
  IBotControl,
  MarketData,
  TBotContext,
} from "../types";

export function createContext<T extends IBotConfiguration>(
  control: IBotControl,
  config: T,
  exchange: IExchange,
  command: "start" | "stop" | "process", // @todo add type in file
  state: BotState,
  market: MarketData = {
    candles: [],
  },
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
  };
}
