import type { IBotConfiguration, IBotControl } from "../types";
import type { TBotContext } from "../types/bot/bot-context.type";

export function createContext<T extends IBotConfiguration>(
  control: IBotControl,
  config: T,
  command: "start" | "stop" | "process", // @todo add type in file
): TBotContext<T> {
  return {
    control,
    config,
    command,
    onStart: command === "start",
    onStop: command === "stop",
    onProcess: command === "process",
  };
}
