import type { ICandlestick, IOrderbook, ITicker, ITrade } from "../exchange/index.js";

/**
 * Action that strategy should perform:
 *
 * - `start`: Bot started by the user
 * - `stop`: Bot stopped by the user
 * - `process`: Execute strategy logic, e.g. when an order is filled, or a candle is closed
 */
export const StrategyAction = {
  start: "start",
  stop: "stop",
  process: "process",
} as const;
export type StrategyAction = (typeof StrategyAction)[keyof typeof StrategyAction];

/**
 * Event that triggers strategy execution
 */
export const StrategyTriggerEventType = {
  onOrderFilled: "onOrderFilled",
  onCandleClosed: "onCandleClosed",
  onPublicTrade: "onPublicTrade",
  onOrderbookChange: "onOrderbookChange",
  onTickerChange: "onTickerChange",
} as const;
export type StrategyTriggerEventType = (typeof StrategyTriggerEventType)[keyof typeof StrategyTriggerEventType];

/**
 * An error occurred during strategy execution
 */
export type StrategyError = {
  message: string;
  stack?: string;
};

export interface MarketData {
  /**
   * Last closed candlestick. May be `undefined` if the bot has just started or if the strategy policy is not subscribed
   * to the candlesticks channel.
   */
  candle?: ICandlestick;
  /**
   * Candles history. Last candle can be accessed by `candles[candles.length - 1]`
   */
  candles: ICandlestick[];
  /**
   * Last public trade
   */
  trade?: ITrade;
  orderbook?: IOrderbook;
  ticker?: ITicker;
}
