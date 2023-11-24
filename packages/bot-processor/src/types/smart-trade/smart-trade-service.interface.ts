import type { ReplaceSmartTradeEffect } from "../../effects";
import type { SmartTrade } from "./smart-trade.type";

export type ISmartTradeService = SmartTrade & {
  /**
   * Create a new SmartTrade with same buy/sell orders
   */
  replace: () => ReplaceSmartTradeEffect;

  /**
   * Return `true` if buy and sell orders were filled
   */
  isCompleted: () => boolean;
};
