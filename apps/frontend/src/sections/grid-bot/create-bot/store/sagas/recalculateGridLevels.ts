import { SagaIterator } from "redux-saga";
import { calcGridLines } from "@bifrost/tools";
import { setGridLines } from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectGridLinesNumber,
  selectHighPrice,
  selectLowPrice,
  selectQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { put, select } from "redux-saga/effects";

export function* recalculateGridLevels(): SagaIterator {
  const highPrice: number = yield select(selectHighPrice);
  const lowPrice: number = yield select(selectLowPrice);
  const gridLinesNumber: number = yield select(selectGridLinesNumber);
  const quantityPerGrid: string = yield select(selectQuantityPerGrid);

  const gridLines = calcGridLines(
    highPrice,
    lowPrice,
    gridLinesNumber,
    Number(quantityPerGrid)
  );

  yield put(setGridLines(gridLines));
}
