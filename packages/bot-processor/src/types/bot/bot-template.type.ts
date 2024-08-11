import type { ZodObject } from "zod";
import type { TBotContext } from "./bot-context.type.js";
import type { IBotConfiguration } from "./bot-configuration.interface.js";

export interface BotTemplate<T extends IBotConfiguration> {
  (ctx: TBotContext<T>): Generator<unknown, unknown>;
  /**
   * Display name of the bot. Used in the UI.
   */
  displayName?: string;
  /**
   * Number of candles the strategy requires for warm-up.
   * When the bot starts, it will download the required number of candles.
   */
  requiredHistory?: number;
  /**
   * Strategy params schema.
   */
  schema: ZodObject<any, any, any>;
  /**
   * If true, the bot will not be displayed in the list of available strategies.
   * Mainly used for debug strategies.
   */
  hidden?: boolean;
  /**
   * Run policy for the bot.
   */
  runPolicy?: {
    /**
     * List of pairs to watch for trades.
     */
    watchTrades?: string | string[] | ((botConfig: T) => string | string[]);
  };
}
