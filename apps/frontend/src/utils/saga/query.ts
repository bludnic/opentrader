import { put, StrictEffect } from "redux-saga/effects";

/**
 * Query RTK for saga.
 *
 * @param fn
 * @param args
 */
export function* query<
  Fn extends {
    initiate: (arg: any, options?: any) => any;
  }
>(
  fn: Fn,
  ...args: Parameters<Fn["initiate"]>
): Generator<
  StrictEffect | any,
  Extract<
    Awaited<ReturnType<ReturnType<Fn["initiate"]>>>,
    { status: "fulfilled" }
  >
> {
  const thunkAction = fn.initiate(args[0], args[1]);
  const promise = yield put(thunkAction);

  const result = yield promise;

  if ((result as any).status === "fulfilled") {
    return result as any;
  }

  throw Error("Something went wrong");
}
