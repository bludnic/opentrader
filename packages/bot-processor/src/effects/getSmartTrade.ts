import type { GetSmartTradeEffect } from "./common/types/get-smart-trade-effect";
import { GET_SMART_TRADE } from "./common/types/effect-types";
import { makeEffect } from "./utils/make-effect";

export function getSmartTrade(ref: string): GetSmartTradeEffect {
  return makeEffect(GET_SMART_TRADE, undefined, ref);
}
