import { TBotContext } from "./bot-context.type";
import { IBotConfiguration } from "./bot-configuration.interface";

export type BotTemplate<T extends IBotConfiguration> = (
  ctx: TBotContext<T>,
) => Generator<unknown, unknown>;
