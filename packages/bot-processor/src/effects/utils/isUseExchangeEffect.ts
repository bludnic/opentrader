import { USE_EXCHANGE } from "../common/types/effect-types";
import type { UseExchangeEffect } from "../common/types/use-exchange-effect";

export function isUseExchangeEffect(
  effect: unknown,
): effect is UseExchangeEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- this is required
  return (effect && (effect as any).type) === USE_EXCHANGE;
}
