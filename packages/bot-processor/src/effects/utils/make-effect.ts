// @ts-nocheck
import { BaseEffect } from "../common/types/base-effect";
import { EffectType } from "../common/types/effect-types";

export const makeEffect = <T extends EffectType, P, K>(type: T, payload?: P, ref?: K): BaseEffect<T, P, K> => {
    return {
      ref,
        type,
        payload
    }
}
