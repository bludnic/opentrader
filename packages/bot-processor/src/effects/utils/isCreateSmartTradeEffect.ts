import type { CreateSmartTradeEffect } from "../common/types/create-smart-trade-effect";
import { CREATE_SMART_TRADE } from "../common/types/effect-types";

export function isCreateSmartTradeEffect(
  effect: unknown,
): effect is CreateSmartTradeEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- this is required
  return (effect && (effect as any).type) === CREATE_SMART_TRADE;
}
