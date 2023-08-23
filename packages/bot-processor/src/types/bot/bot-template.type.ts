import { IBotConfiguration } from "./bot-configuration.interface";
import { IBotControl } from "./bot-control.interface";

export type BotTemplate<T extends IBotConfiguration> = (
  bot: IBotControl<T>
) => Generator<unknown, unknown>;
