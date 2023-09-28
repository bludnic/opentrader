import { IBotConfiguration, IBotControl } from "../types";
import { TBotContext } from "../types/bot/bot-context.type";

export function createContext<T extends IBotConfiguration>(
  control: IBotControl<T>,
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
