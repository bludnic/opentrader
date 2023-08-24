import {
  calcGridLinesWithPriceFilter,
  findHighestCandlestickBy,
  findLowestCandlestickBy
} from "@bifrost/tools";
import { put } from "redux-saga/effects";
import {
  setExchangeAccountId,
  setExchangeCode,
  setGridLines,
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
  setSymbolId,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import { DEFAULT_GRID_LINES_NUMBER } from "src/sections/grid-bot/create-bot/store/bot-form/constants";
import { calcMinQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form/helpers";
import { selectBarSize } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { markPageAsReady } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { rtkApi } from "src/lib/bifrost/rtkApi";
import { marketsApi } from "src/lib/markets/marketsApi";
import { startOfYearISO } from "src/utils/date/startOfYearISO";
import { todayISO } from "src/utils/date/todayISO";
import { query } from "src/utils/saga/query";
import { typedSelect } from "src/utils/saga/select";

export function* initPageWorker(): Iterator<any, any, any> {
  // Fetch exchange accounts
  const {
    data: { exchangeAccounts },
  } = yield* query(rtkApi.endpoints.getExchangeAccounts);

  const firstExchangeAccount = exchangeAccounts[0];
  yield put(setExchangeAccountId(firstExchangeAccount.id));
  yield put(setExchangeCode(firstExchangeAccount.exchangeCode));

  // Fetch symbols
  const {
    data: { symbols },
  } = yield* query(
    rtkApi.endpoints.getSymbols,
    firstExchangeAccount.exchangeCode
  );

  const firstSymbol = symbols[0];
  yield put(setSymbolId(firstSymbol.symbolId));

  const minQuantityPerGrid = calcMinQuantityPerGrid(
    firstSymbol.filters.lot.minQuantity
  );
  yield put(setQuantityPerGrid(minQuantityPerGrid));

  // Fetch candlesticks
  const barSize = yield* typedSelect(selectBarSize);
  const {
    data: { candlesticks },
  } = yield* query(marketsApi.endpoints.getCandlesticks, {
    symbolId: firstSymbol.symbolId,
    timeframe: barSize,
    startDate: startOfYearISO(),
    endDate: todayISO(),
  });

  const highestCandlestick = findHighestCandlestickBy("close", candlesticks);
  const lowestCandlestick = findLowestCandlestickBy("close", candlesticks);

  yield put(setLowPrice(lowestCandlestick.close));
  yield put(setHighPrice(highestCandlestick.close));

  const gridLines = calcGridLinesWithPriceFilter(
    highestCandlestick.close,
    lowestCandlestick.close,
    DEFAULT_GRID_LINES_NUMBER,
    Number(minQuantityPerGrid),
    firstSymbol.filters
  );
  yield put(setGridLines(gridLines));

  // Fetch current asset price
  const currentAssetPriceData = yield* query(
    rtkApi.endpoints.getSymbolCurrentPrice,
    firstSymbol.symbolId
  );

  yield put(markPageAsReady());
}
