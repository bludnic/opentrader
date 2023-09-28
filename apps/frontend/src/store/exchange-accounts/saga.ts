import { AxiosResponse } from "axios";
import { SagaIterator } from "redux-saga";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import { GetExchangeAccountsResponseBodyDto } from "src/lib/bifrost/client";
import {
  fetchExchangeAccounts,
  fetchExchangeAccountsFailed,
  fetchExchangeAccountsSucceeded,
} from "./reducers";

function* fetchExchangeAccountsWorker() {
  try {
    const { data }: AxiosResponse<GetExchangeAccountsResponseBodyDto> =
      yield call(bifrostApi.getExchangeAccounts);

    yield put(fetchExchangeAccountsSucceeded(data.exchangeAccounts));
  } catch (err) {
    yield put(fetchExchangeAccountsFailed(err as Error));
  }
}

export function* fetchExchangeAccountsWatcher(): SagaIterator {
  yield all([
    takeLatest(fetchExchangeAccounts.type, fetchExchangeAccountsWorker),
  ]);
}
