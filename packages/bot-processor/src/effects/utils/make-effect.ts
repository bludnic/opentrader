// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- need investigation
// @ts-nocheck
import type { BaseEffect } from "../common/types/base-effect";
import type { EffectType } from "../common/types/effect-types";

export const makeEffect = <T extends EffectType, P, K>(
  type: T,
  payload?: P,
  ref?: K,
): BaseEffect<T, P, K> => {
  return {
    ref,
    type,
    payload,
  };
};
