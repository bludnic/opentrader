import { put, StrictEffect } from "redux-saga/effects";

/**
 * Mutation RTK for saga.
 *
 * @param fn
 * @param arg
 * @param options
 */
export function* mutation<
  Fn extends {
    initiate: (arg: any, options?: any) => any;
  }
>(
  fn: Fn,
  arg: Parameters<Fn["initiate"]>[0],
  options?: Parameters<Fn["initiate"]>[1]
): Generator<
  StrictEffect | any,
  Extract<Awaited<ReturnType<ReturnType<Fn["initiate"]>>>, { data: any }>
> {
  const thunkAction = fn.initiate(arg, options);
  const promise = yield put(thunkAction);

  const result = yield promise;

  if ((result as any).error) {
    throw (result as any).error;
  }

  return result as any;
}
