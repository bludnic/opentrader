import { REPLACE_SMART_TRADE } from "../common/types/effect-types";
import { ReplaceSmartTradeEffect } from "../common/types/replace-smart-trade-effect";

export function isReplaceSmartTradeEffect(
  effect: unknown
): effect is ReplaceSmartTradeEffect {
  return (effect && (effect as any).type) === REPLACE_SMART_TRADE;
}
