import { EffectType } from "./effect-type"

export type Effect<T extends EffectType, P> = {
    type: T,
    payload: P
}