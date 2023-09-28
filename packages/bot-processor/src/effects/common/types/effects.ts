import { CancelSmartTradeEffect } from "./cancel-smart-trade-effect";
import { ReplaceSmartTradeEffect } from "./replace-smart-trade-effect";
import { UseExchangeEffect } from "./use-exchange-effect";
import { UseSmartTradeEffect } from "./use-smart-trade-effect";

// @todo not used
export type Effect =
  | UseSmartTradeEffect
  | ReplaceSmartTradeEffect
  | CancelSmartTradeEffect
  | UseExchangeEffect;
