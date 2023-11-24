import type { SmartTrade } from "../../../types";
import type { BaseEffect } from "./base-effect";
import type { REPLACE_SMART_TRADE } from "./effect-types";

export type ReplaceSmartTradeEffect = BaseEffect<
  typeof REPLACE_SMART_TRADE,
  SmartTrade,
  string
>;
