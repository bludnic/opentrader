import { SmartTrade } from "../types";
import { REPLACE_SMART_TRADE } from "./common/types/effect-types";
import { ReplaceSmartTradeEffect } from "./common/types/replace-smart-trade-effect";
import { makeEffect } from "./utils/make-effect";

export function replaceSmartTrade(
  ref: string,
  params: SmartTrade
): ReplaceSmartTradeEffect {
  return makeEffect(REPLACE_SMART_TRADE, params, ref);
}
