import { BarSize } from "@opentrader/types";
import { BotTemplate, IBotConfiguration } from "@opentrader/bot-processor";

/**
 * Either return the strategy timeframe or the bot timeframe.
 * If both are not provided, return `undefined`.
 */
export function getTimeframe<T extends IBotConfiguration>(strategyFn: BotTemplate<T>, botConfig: T): BarSize | null {
  let strategyTimeframe: BarSize | null | undefined;

  if (typeof strategyFn.timeframe === "function") {
    strategyTimeframe = strategyFn.timeframe(botConfig);
  } else {
    strategyTimeframe = strategyFn.timeframe;
  }

  return strategyTimeframe || botConfig.timeframe || null;
}
