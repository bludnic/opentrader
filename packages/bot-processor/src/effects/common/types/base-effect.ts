export type BaseEffect<T, P, R = undefined> = {
  type: T;
  ref: R;
  payload: P;
};
