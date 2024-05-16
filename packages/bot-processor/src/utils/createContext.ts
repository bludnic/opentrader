import type { IExchange } from "@opentrader/exchanges";
import type { IBotConfiguration, IBotControl, TBotContext } from "../types";

export function createContext<T extends IBotConfiguration>(
  control: IBotControl,
  config: T,
  exchange: IExchange,
  command: "start" | "stop" | "process", // @todo add type in file
): TBotContext<T> {
  return {
    control,
    config,
    exchange,
    command,
    onStart: command === "start",
    onStop: command === "stop",
    onProcess: command === "process",
  };
}
