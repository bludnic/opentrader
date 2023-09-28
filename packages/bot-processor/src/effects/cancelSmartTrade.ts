import { CancelSmartTradeEffect } from "./common/types/cancel-smart-trade-effect";
import { CANCEL_SMART_TRADE } from "./common/types/effect-types";
import { makeEffect } from "./utils/make-effect";

export function cancelSmartTrade(ref: string): CancelSmartTradeEffect {
  return makeEffect(CANCEL_SMART_TRADE, undefined, ref);
}
