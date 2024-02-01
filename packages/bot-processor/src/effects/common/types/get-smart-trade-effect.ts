import type { BaseEffect } from "./base-effect";
import type { GET_SMART_TRADE } from "./effect-types";

export type GetSmartTradeEffect = BaseEffect<
  typeof GET_SMART_TRADE,
  undefined,
  string
>;
