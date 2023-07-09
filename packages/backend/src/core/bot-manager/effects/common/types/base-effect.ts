export type BaseEffect<T, P, K = undefined> = {
    type: T;
    key: K;
    payload: P
}
