import { BarSize } from "@bifrost/types/dist/common/enums/bar-size.enum";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { SagaIterator } from "redux-saga";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import { GetCandlesticksHistoryResponseDto } from "src/lib/bifrost/client";
import { FetchCandlesticksActionPayload } from "./actions";
import {
  fetchCandlesticks,
  fetchCandlesticksSucceeded,
  fetchCandlesticksFailed,
  requestCandlesticks,
} from "./reducers";

function* requestCandlesticksWorker(
  action: PayloadAction<FetchCandlesticksActionPayload>
) {
  const { symbolId } = action.payload;

  yield put(fetchCandlesticks({ symbolId }));

  try {
    const { data }: AxiosResponse<GetCandlesticksHistoryResponseDto> =
      yield call(bifrostApi.candlesHistory, symbolId, BarSize.FOUR_HOURS);

    yield put(fetchCandlesticksSucceeded(data.history.candlesticks));
  } catch (err) {
    yield put(fetchCandlesticksFailed(err as Error));
  }
}

export function* requestCandlesticksWatcher(): SagaIterator {
  yield all([takeLatest(requestCandlesticks.type, requestCandlesticksWorker)]);
}
