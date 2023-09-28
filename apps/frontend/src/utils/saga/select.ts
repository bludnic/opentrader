import { SelectEffect, Tail } from "@redux-saga/core/effects";
import { select as originalSelect, Effect } from "redux-saga/effects";
import { RootState } from "src/store";

export type SagaGenerator<RT, E extends Effect = Effect<any, any>> = Generator<
  E,
  RT
>;

/**
 * Typed `select()` effect for `redux-saga`
 *
 * @param selector
 * @param args
 */
export function* typedSelect<
  Fn extends (state: RootState, ...args: any[]) => any
>(
  selector: Fn,
  ...args: Tail<Parameters<Fn>>
): SagaGenerator<ReturnType<Fn>, SelectEffect> {
  let result = yield originalSelect(selector, ...args);

  return result as any;
}
