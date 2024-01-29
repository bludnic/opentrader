import { REPLACE_SMART_TRADE } from "../common/types/effect-types";
import type { ReplaceSmartTradeEffect } from "../common/types/replace-smart-trade-effect";

export function isReplaceSmartTradeEffect(
  effect: unknown,
): effect is ReplaceSmartTradeEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- this is required
  return (effect && (effect as any).type) === REPLACE_SMART_TRADE;
}
