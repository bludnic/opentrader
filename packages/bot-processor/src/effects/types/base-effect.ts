import type { EffectType } from "./effect-types.js";

export type BaseEffect<T extends EffectType, P = undefined, R = undefined> = {
  type: T;
  ref: R;
  payload: P;
};
