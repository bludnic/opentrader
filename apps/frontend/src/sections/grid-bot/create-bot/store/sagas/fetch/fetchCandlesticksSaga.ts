import { BarSize } from "@bifrost/types";
import { AxiosResponse } from "axios";
import { call, put } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import {
  GetCandlesticksHistoryResponseDto,
  SymbolInfoDto,
} from "src/lib/bifrost/client";
import {
  fetchCandlesticks,
  fetchCandlesticksSucceeded,
} from "src/store/candlesticks";

export function* fetchCandlesticksSaga(symbol: SymbolInfoDto) {
  yield put(
    fetchCandlesticks({
      baseCurrency: symbol.baseCurrency,
      quoteCurrency: symbol.quoteCurrency,
    })
  );

  const {
    data: { history },
  }: AxiosResponse<GetCandlesticksHistoryResponseDto> = yield call(
    bifrostApi.candlesHistory,
    symbol.symbolId,
    BarSize.FOUR_HOURS
  );

  yield put(fetchCandlesticksSucceeded(history.candlesticks));

  return {
    candlesticks: history.candlesticks,
  };
}
