import type { UseIndicatorsEffect } from "../common/types/use-indicators-effect";
import { USE_INDICATORS } from "../common/types/effect-types";

export function isUseIndicatorsEffect(
  effect: unknown,
): effect is UseIndicatorsEffect {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- this is required
  return (effect && (effect as any).type) === USE_INDICATORS;
}
