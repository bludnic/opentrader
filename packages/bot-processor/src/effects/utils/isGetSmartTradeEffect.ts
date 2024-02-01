import type { GetSmartTradeEffect } from "../common/types/get-smart-trade-effect";
import { GET_SMART_TRADE } from "../common/types/effect-types";

export function isGetSmartTradeEffect(
  effect: unknown,
): effect is GetSmartTradeEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- this is required
  return (effect && (effect as any).type) === GET_SMART_TRADE;
}
