import {
  calcGridLines,
  findHighestCandlestickBy,
  findLowestCandlestickBy,
} from "@bifrost/tools";
import { BarSize } from "@bifrost/types";
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
import {
  selectBarSize,
  selectCurrencyPair,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { put } from "redux-saga/effects";
import { rtkApi } from "src/lib/bifrost/rtkApi";
import { query } from "src/utils/saga/query";
import { typedSelect } from "src/utils/saga/select";

export function* changeCurrencyPairWorker(): SagaIterator {
  const currencyPair = yield* typedSelect(selectCurrencyPair);
  const {
    data: { symbols },
  } = yield* query(rtkApi.endpoints.getSymbols);

  const symbol = symbols.find(
    (symbol) => symbol.symbolId === currencyPair
  ) as SymbolInfoDto;

  const minQuantityPerGrid = calcMinQuantityPerGrid(
    symbol.filters.lot.minQuantity
  );
  yield put(setQuantityPerGrid(minQuantityPerGrid));

  const barSize = yield* typedSelect(selectBarSize);
  const currentAssetPrice = yield* query(
    rtkApi.endpoints.getCurrentAssetPrice,
    symbol.symbolId
  );
  const {
    data: {
      history: { candlesticks },
    },
  } = yield* query(rtkApi.endpoints.getCandlesticksHistory, {
    symbolId: symbol.symbolId,
    barSize,
  });

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
