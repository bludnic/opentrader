import {
  calcGridLinesWithPriceFilter,
  findHighestCandlestickBy,
  findLowestCandlestickBy,
} from "@bifrost/tools";
import { SagaIterator } from "redux-saga";
import {
  setGridLines,
  setHighPrice,
  setLowPrice,
  setQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import { DEFAULT_GRID_LINES_NUMBER } from "src/sections/grid-bot/create-bot/store/bot-form/constants";
import { calcMinQuantityPerGrid } from "src/sections/grid-bot/create-bot/store/bot-form/helpers";
import {
  selectBarSize,
  selectSymbolId
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { put } from "redux-saga/effects";
import { rtkApi } from "src/lib/bifrost/rtkApi";
import { marketsApi } from "src/lib/markets/marketsApi";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { startOfYearISO } from "src/utils/date/startOfYearISO";
import { todayISO } from "src/utils/date/todayISO";
import { query } from "src/utils/saga/query";
import { typedSelect } from "src/utils/saga/select";

export function* changeCurrencyPairWorker(): SagaIterator {
  const symbolId = yield* typedSelect(selectSymbolId);
  const symbol = yield* typedSelect(selectSymbolById(symbolId));

  const minQuantityPerGrid = calcMinQuantityPerGrid(
    symbol.filters.lot.minQuantity
  );
  yield put(setQuantityPerGrid(minQuantityPerGrid));

  const barSize = yield* typedSelect(selectBarSize);
  const currentAssetPrice = yield* query(
    rtkApi.endpoints.getSymbolCurrentPrice,
    symbolId
  );
  const {
    data: {
      candlesticks
    },
  } = yield* query(marketsApi.endpoints.getCandlesticks, {
    symbolId,
    timeframe: barSize,
    startDate: startOfYearISO(),
    endDate: todayISO()
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
    symbol.filters
  );
  yield put(setGridLines(gridLines));
}
