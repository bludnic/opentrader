import type { ZodObject } from "zod";
import { BarSize, StrategyTriggerEventType } from "@opentrader/types";
import type { TBotContext } from "./bot-context.type.js";
import type { IBotConfiguration } from "./bot-configuration.interface.js";

export type WatchCondition<T extends IBotConfiguration> = string | string[] | ((botConfig: T) => string | string[]);

// @todo move to types
export const Watcher = {
  watchTrades: "watchTrades",
  watchOrderbook: "watchOrderbook",
  watchTicker: "watchTicker",
  watchCandles: "watchCandles",
} as const;
export type Watcher = (typeof Watcher)[keyof typeof Watcher];

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
   * Used to aggregate 1m candles to a higher timeframe, when using candles watcher.
   * If not provided, the timeframe from the bot config will be used.
   */
  timeframe?: BarSize | null | ((botConfig: T) => BarSize | null | undefined);
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
   * List of pairs to watch for trades.
   *
   * @example Watch trades on BTC/USDT pair. The default exchange from bot config will be used.
   * ```ts
   * strategy.watchers = {
   *   watchTrades: "BTC/USDT",
   * }
   * ```
   *
   * @example Watch trades on specific exchange.
   * ```ts
   * strategy.watchers = {
   *   watchTrades: "OKX:BTC/USDT"
   * }
   * ```
   *
   * @example Watch trades on multiple pairs.
   * ```ts
   * strategy.watchers = {
   *   watchTrades: ["BTC/USDT", "ETH/USDT"],
   * }
   * ```
   *
   * @example Watch trades on different exchanges.
   * ```ts
   * strategy.watchers = {
   *  watchTrades: ["OKX:BTC/USDT", "BINANCE:BTC/USDT"]
   * }
   * ```
   *
   * @example Watch trades on a computed pairs list.
   * ```ts
   * strategy.watchers = {
   *  watchTrades: (botConfig) => botConfig.symbol
   * }
   * ```
   */
  watchers?: {
    [Watcher.watchTrades]?: WatchCondition<T>;
    [Watcher.watchOrderbook]?: WatchCondition<T>;
    [Watcher.watchTicker]?: WatchCondition<T>;
    [Watcher.watchCandles]?: WatchCondition<T>;
  };
  runPolicy?: {
    /**
     * The size of the candle is determined by `timeframe` property above.
     * If not provided, the channel will listen to 1m candles.
     */
    [StrategyTriggerEventType.onCandleClosed]?: boolean | ((botConfig: T) => boolean);
    [StrategyTriggerEventType.onPublicTrade]?: boolean | ((botConfig: T) => boolean);
    [StrategyTriggerEventType.onOrderbookChange]?: boolean | ((botConfig: T) => boolean);
    [StrategyTriggerEventType.onTickerChange]?: boolean | ((botConfig: T) => boolean);
    [StrategyTriggerEventType.onOrderFilled]?: boolean | ((botConfig: T) => boolean);
  };
}
