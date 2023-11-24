import { USE_SMART_TRADE } from "../common/types/effect-types";
import type { UseSmartTradeEffect } from "../common/types/use-smart-trade-effect";

export function isUseSmartTradeEffect(
  effect: unknown,
): effect is UseSmartTradeEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- this is required
  return (effect && (effect as any).type) === USE_SMART_TRADE;
}
