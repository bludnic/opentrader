import { SagaIterator } from "redux-saga";
import { calcGridLinesWithPriceFilter } from "@opentrader/tools";
import { setGridLines } from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
  selectSymbolId,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { put } from "redux-saga/effects";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { typedSelect } from "src/utils/saga/select";

export function* recalculateGridLevels(): SagaIterator {
  const highPrice = yield* typedSelect(selectHighPrice);
  const lowPrice = yield* typedSelect(selectLowPrice);
  const gridLinesNumber = yield* typedSelect(selectGridLinesNumber);
  const quantityPerGrid = yield* typedSelect(selectQuantityPerGrid);

  const symbolId = yield* typedSelect(selectSymbolId);
  const symbol = selectSymbolById(symbolId);

  const gridLines = calcGridLinesWithPriceFilter(
    highPrice,
    lowPrice,
    gridLinesNumber,
    Number(quantityPerGrid),
    symbol.filters,
  );

  yield put(setGridLines(gridLines));
}
