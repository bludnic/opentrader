import type { BaseEffect } from "./base-effect";
import type { CANCEL_SMART_TRADE } from "./effect-types";

export type CancelSmartTradeEffect = BaseEffect<
  typeof CANCEL_SMART_TRADE,
  undefined,
  string
>;
