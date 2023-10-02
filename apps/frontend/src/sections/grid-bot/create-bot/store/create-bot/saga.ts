import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, SagaReturnType } from "redux-saga/effects";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TGridBotCreateInput } from "src/types/trpc";

import { createGridBotSucceeded, createGridBotFailed } from "./reducers";

export function* createGridBotWorker(
  action: PayloadAction<TGridBotCreateInput>,
) {
  try {
    const gridBot: SagaReturnType<typeof trpcApi.gridBot.create.mutate> =
      yield call(trpcApi.gridBot.create.mutate, action.payload);

    yield put(createGridBotSucceeded(gridBot));
  } catch (err) {
    yield put(createGridBotFailed(err as Error));
  }
}
