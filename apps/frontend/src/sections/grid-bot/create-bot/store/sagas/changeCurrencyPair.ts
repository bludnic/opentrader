import {
  calcGridLines,
  findHighestCandlestickBy,
  findLowestCandlestickBy,
} from "@bifrost/tools";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { SagaIterator } from "redux-saga";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import {
  GetCandlesticksHistoryResponseDto,
  SymbolInfoDto,
} from "src/lib/bifrost/client";
import {
  changeHighPrice,
  changeLowPrice,
  changeQuantityPerGrid,
  setGridLines,
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  DEFAULT_GRID_LINES_NUMBER,
  DEFAULT_QUANTITY_PER_GRID,
} from "src/sections/grid-bot/create-bot/store/bot-form/constants";
import { calcMinQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form/helpers";
import { selectCurrencyPair } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { put, select } from "redux-saga/effects";
import { fetchCandlesticksSaga } from "src/sections/grid-bot/create-bot/store/sagas/fetch/fetchCandlesticksSaga";
import { fetchCurrentAssetPriceSaga } from "src/sections/grid-bot/create-bot/store/sagas/fetch/fetchCurrentAssetPriceSaga";
import { selectSymbolById } from "src/store/symbols/selectors";

export function* changeCurrencyPairWorker(): SagaIterator {
  const currencyPair: string = yield select(selectCurrencyPair);
  const symbol: SymbolInfoDto = yield select(selectSymbolById(currencyPair));

  const minQuantityPerGrid = calcMinQuantityPerGrid(
    symbol.filters.lot.minQuantity
  );
  yield put(setQuantityPerGrid(minQuantityPerGrid));

  yield* fetchCurrentAssetPriceSaga(symbol);
  const { candlesticks } = yield* fetchCandlesticksSaga(symbol);

  const highestCandlestick = findHighestCandlestickBy("close", candlesticks);
  const lowestCandlestick = findLowestCandlestickBy("close", candlesticks);

  yield put(setLowPrice(lowestCandlestick.close));
  yield put(setHighPrice(highestCandlestick.close));

  const gridLines = calcGridLines(
    highestCandlestick.close,
    lowestCandlestick.close,
    DEFAULT_GRID_LINES_NUMBER,
    Number(minQuantityPerGrid)
  );
  yield put(setGridLines(gridLines));
}
