import { BaseEffect } from "../common/types/base-effect";
import { EffectType } from "../common/types/effect-types";

export const makeEffect = <T extends EffectType, P, K>(type: T, payload?: P, key?: K): BaseEffect<T, P, K> => {
    return {
        key,
        type,
        payload
    }
}