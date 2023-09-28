import { SmartTrade } from "../../../types";
import { BaseEffect } from "./base-effect";
import { REPLACE_SMART_TRADE } from "./effect-types";

export type ReplaceSmartTradeEffect = BaseEffect<
  typeof REPLACE_SMART_TRADE,
  SmartTrade,
  string
>;
