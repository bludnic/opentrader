import type { ZodObject } from "zod";
import type { TBotContext } from "./bot-context.type.js";
import type { IBotConfiguration } from "./bot-configuration.interface.js";

export interface BotTemplate<T extends IBotConfiguration> {
  (ctx: TBotContext<T>): Generator<unknown, unknown>;
  requiredHistory?: number;
  schema: ZodObject<any, any, any>;
}
