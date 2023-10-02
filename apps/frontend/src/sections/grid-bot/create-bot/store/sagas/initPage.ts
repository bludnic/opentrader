import {
  calcGridLinesWithPriceFilter,
  findHighestCandlestickBy,
  findLowestCandlestickBy,
} from "@opentrader/tools";
import { ExchangeCode } from "@opentrader/types";
import { call, put, SagaReturnType } from "redux-saga/effects";
import { trpcApi } from "src/lib/trpc/endpoints";
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
import { marketsApi } from "src/lib/markets/marketsApi";
import { startOfYearISO } from "src/utils/date/startOfYearISO";
import { todayISO } from "src/utils/date/todayISO";
import { query } from "src/utils/saga/query";
import { typedSelect } from "src/utils/saga/select";

export function* initPageWorker(): Iterator<any, any, any> {
  // Fetch exchange accounts
  const exchangeAccounts: SagaReturnType<
    typeof trpcApi.exchangeAccount.list.query
  > = yield call(trpcApi.exchangeAccount.list.query);

  const firstExchangeAccount = exchangeAccounts[0];
  yield put(setExchangeAccountId(firstExchangeAccount.id));
  yield put(setExchangeCode(firstExchangeAccount.exchangeCode));

  // Fetch symbols
  const symbols: SagaReturnType<typeof trpcApi.symbol.list.query> = yield call(
    trpcApi.symbol.list.query,
    {
      input: firstExchangeAccount.exchangeCode as ExchangeCode,
    },
  );

  const firstSymbol = symbols[0];
  yield put(setSymbolId(firstSymbol.symbolId));

  const minQuantityPerGrid = calcMinQuantityPerGrid(
    firstSymbol.filters.lot.minQuantity,
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
    firstSymbol.filters,
  );
  yield put(setGridLines(gridLines));

  // The method must be called to cache the value
  // Further it will be used inside selectors
  const currentAssetPriceData: SagaReturnType<
    typeof trpcApi.symbol.price.query
  > = yield call(trpcApi.symbol.price.query, {
    input: {
      symbolId: firstSymbol.symbolId,
    },
  });

  yield put(markPageAsReady());
}
