import { AxiosResponse } from "axios";
import { call, put } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import { GetSymbolsResponseBodyDto } from "src/lib/bifrost/client";
import { fetchSymbols, fetchSymbolsSucceeded } from "src/store/symbols";

export function* fetchSymbolsSaga() {
  yield put(fetchSymbols());

  const {
    data: { symbols },
  }: AxiosResponse<GetSymbolsResponseBodyDto> = yield call(
    bifrostApi.getSymbols
  );

  yield put(fetchSymbolsSucceeded(symbols));

  return {
    symbols,
  };
}
