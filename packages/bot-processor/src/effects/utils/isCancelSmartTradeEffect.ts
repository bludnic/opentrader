import { CancelSmartTradeEffect } from "../common/types/cancel-smart-trade-effect";
import { CANCEL_SMART_TRADE } from "../common/types/effect-types";

export function isCancelSmartTradeEffect(
  effect: unknown,
): effect is CancelSmartTradeEffect {
  return (effect && (effect as any).type) === CANCEL_SMART_TRADE;
}
