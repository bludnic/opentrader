import type { CancelSmartTradeEffect } from "../common/types/cancel-smart-trade-effect";
import { CANCEL_SMART_TRADE } from "../common/types/effect-types";

export function isCancelSmartTradeEffect(
  effect: unknown,
): effect is CancelSmartTradeEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- this is required
  return (effect && (effect as any).type) === CANCEL_SMART_TRADE;
}
