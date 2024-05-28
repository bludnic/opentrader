import type { ZodObject } from "zod";
import type { TBotContext } from "./bot-context.type";
import type { IBotConfiguration } from "./bot-configuration.interface";

export interface BotTemplate<T extends IBotConfiguration> {
  (ctx: TBotContext<T>): Generator<unknown, unknown>;
  requiredHistory?: number;
  schema: ZodObject<any, any, any>;
}
