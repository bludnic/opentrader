import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { SagaIterator } from "redux-saga";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import {
  GetCurrentAssetPriceResponseDto,
} from "src/lib/bifrost/client";
import { FetchCurrentAssetPriceActionPayload } from "./actions";
import {
  fetchCurrentAssetPrice,
  fetchCurrentAssetPriceSucceeded,
  fetchCurrentAssetPriceFailed,
} from "./reducers";

function* fetchCurrentAssetPriceWorker(
  action: PayloadAction<FetchCurrentAssetPriceActionPayload>
) {
  const { symbolId } = action.payload;

  try {
    const { data }: AxiosResponse<GetCurrentAssetPriceResponseDto> = yield call(
      bifrostApi.getCurrentAssetPrice,
      symbolId
    );

    yield put(fetchCurrentAssetPriceSucceeded(data));
  } catch (err) {
    yield put(fetchCurrentAssetPriceFailed(err as Error));
  }
}

export function* fetchCurrentAssetPriceWatcher(): SagaIterator {
  yield all([takeLatest(fetchCurrentAssetPrice.type, fetchCurrentAssetPriceWorker)]);
}
