import { AxiosResponse } from "axios";
import { SagaIterator } from "redux-saga";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import { GetSymbolsResponseBodyDto } from "src/lib/bifrost/client";
import {
  fetchSymbols,
  fetchSymbolsSucceeded,
  fetchSymbolsFailed,
} from "./reducers";

function* fetchSymbolsWorker() {
  try {
    const { data }: AxiosResponse<GetSymbolsResponseBodyDto> = yield call(
      bifrostApi.getSymbols
    );

    yield put(fetchSymbolsSucceeded(data.symbols));
  } catch (err) {
    yield put(fetchSymbolsFailed(err as Error));
  }
}

export function* fetchSymbolsWatcher(): SagaIterator {
  yield all([takeLatest(fetchSymbols.type, fetchSymbolsWorker)]);
}
