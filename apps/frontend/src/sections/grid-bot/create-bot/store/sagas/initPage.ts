import {
  calcGridLines,
  findHighestCandlestickBy,
  findLowestCandlestickBy,
} from "@bifrost/tools";
import { put } from "redux-saga/effects";
import {
  setCurrencyPair,
  setExchangeAccountId,
  setGridLines,
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import { DEFAULT_GRID_LINES_NUMBER } from "src/sections/grid-bot/create-bot/store/bot-form/constants";
import { calcMinQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form/helpers";
import { markPageAsReady } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { fetchCandlesticksSaga } from "src/sections/grid-bot/create-bot/store/sagas/fetch/fetchCandlesticksSaga";
import { fetchCurrentAssetPriceSaga } from "src/sections/grid-bot/create-bot/store/sagas/fetch/fetchCurrentAssetPriceSaga";
import { fetchSymbolsSaga } from "src/sections/grid-bot/create-bot/store/sagas/fetch/fetchSymbolsSaga";
import { fetchExchangeAccountsSaga } from "src/sections/grid-bot/create-bot/store/sagas/fetch/fetchExchangeAccountsSaga";

export function* initPageWorker() {
  // Fetch exchange accounts
  const { exchangeAccounts } = yield* fetchExchangeAccountsSaga();

  const firstExchangeAccount = exchangeAccounts[0];
  yield put(setExchangeAccountId(firstExchangeAccount.id));

  // Fetch symbols
  const { symbols } = yield* fetchSymbolsSaga();

  const firstSymbol = symbols[0];
  yield put(setCurrencyPair(firstSymbol.symbolId));

  const minQuantityPerGrid = calcMinQuantityPerGrid(
    firstSymbol.filters.lot.minQuantity
  );
  yield put(setQuantityPerGrid(minQuantityPerGrid));

  // Fetch candlesticks
  const { candlesticks } = yield* fetchCandlesticksSaga(firstSymbol);

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

  // Fetch current asset price
  const currentAssetPriceData = yield* fetchCurrentAssetPriceSaga(firstSymbol);

  yield put(markPageAsReady());
}
