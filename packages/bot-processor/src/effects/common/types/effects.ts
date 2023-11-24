import type { CancelSmartTradeEffect } from "./cancel-smart-trade-effect";
import type { ReplaceSmartTradeEffect } from "./replace-smart-trade-effect";
import type { UseExchangeEffect } from "./use-exchange-effect";
import type { UseSmartTradeEffect } from "./use-smart-trade-effect";

// @todo not used
export type Effect =
  | UseSmartTradeEffect
  | ReplaceSmartTradeEffect
  | CancelSmartTradeEffect
  | UseExchangeEffect;
