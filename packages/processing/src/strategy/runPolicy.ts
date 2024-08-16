import { StrategyTriggerEventType } from "@opentrader/types";
import { BotTemplate, IBotConfiguration } from "@opentrader/bot-processor";

/**
 * Determines if the strategy should run based on the run policy and event type.
 *
 * This function checks the `runPolicy` of the strategy and evaluates whether the strategy
 * should run for a given `StrategyTriggerEventType`. If the `runPolicy` for the event type
 * is a function, it will invoke the function with the current bot configuration (`botConfig`).
 *
 * @param strategyFn - The strategy function.
 * @param botConfig - The bot configuration.
 * @param eventType - The market event type. If not provided, it indicates that either start or stop action is performed.
 */
export function shouldRunStrategy<T extends IBotConfiguration>(
  strategyFn: BotTemplate<T>,
  botConfig: T,
  eventType?: StrategyTriggerEventType,
): boolean {
  if (!strategyFn.runPolicy) {
    console.warn(`Strategy ${strategyFn.name} does not have a run policy`);

    return false;
  }

  if (!eventType) {
    // Always execute the strategy template when start/stop bot actions are performed
    return true;
  }

  const { runPolicy } = strategyFn;
  const eventPolicy = runPolicy[eventType];

  if (typeof eventPolicy === "function") {
    return eventPolicy(botConfig) === true;
  }

  return eventPolicy === true;
}
