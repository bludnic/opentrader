import { EffectType } from "./effect-types";

export type BaseEffect<T extends EffectType, P = undefined, R = undefined> = {
  type: T;
  ref: R;
  payload: P;
};
