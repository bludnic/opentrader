import type { BaseEffect, EffectType } from "../types";

export const makeEffect = <T extends EffectType, P = undefined, R = undefined>(
  type: T,
  payload: P,
  ref: R,
): BaseEffect<T, P, R> => {
  return {
    ref,
    type,
    payload,
  };
};

export function isEffect<T extends EffectType, P = undefined, R = undefined>(
  effect: unknown,
): effect is BaseEffect<T, P, R> {
  return !!(effect as BaseEffect<any>)?.type;
}
