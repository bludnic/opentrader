import { SagaIterator } from "redux-saga";
import { calcGridLines } from "@bifrost/tools";
import { setGridLines } from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { put } from "redux-saga/effects";
import { typedSelect } from "src/utils/saga/select";

export function* recalculateGridLevels(): SagaIterator {
  const highPrice = yield* typedSelect(selectHighPrice);
  const lowPrice = yield* typedSelect(selectLowPrice);
  const gridLinesNumber = yield* typedSelect(selectGridLinesNumber);
  const quantityPerGrid = yield* typedSelect(selectQuantityPerGrid);

  const gridLines = calcGridLines(
    highPrice,
    lowPrice,
    gridLinesNumber,
    Number(quantityPerGrid)
  );

  yield put(setGridLines(gridLines));
}
