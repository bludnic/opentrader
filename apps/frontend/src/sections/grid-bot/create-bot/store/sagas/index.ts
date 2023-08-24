import { SagaIterator } from "redux-saga";
import { all, takeLatest } from "redux-saga/effects";
import {
  changeSymbolId,
  changeGridLinesNumber,
  changeHighPrice,
  changeLowPrice,
  changeQuantityPerGrid,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import { createGridBot } from 'src/sections/grid-bot/create-bot/store/create-bot';
import { createGridBotWorker } from 'src/sections/grid-bot/create-bot/store/create-bot/saga';
import { initPage } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { changeCurrencyPairWorker } from "./changeCurrencyPair";
import { recalculateGridLevels } from "./recalculateGridLevels";
import { initPageWorker } from "./initPage";

export function* createGridBotSagas(): SagaIterator {
  yield all([
    takeLatest(initPage.type, initPageWorker),
    takeLatest(changeSymbolId.type, changeCurrencyPairWorker),
    takeLatest(
      [
        changeLowPrice.type,
        changeHighPrice.type,
        changeQuantityPerGrid.type,
        changeGridLinesNumber.type,
      ],
      recalculateGridLevels
    ),
    takeLatest(createGridBot.type, createGridBotWorker)
  ]);
}
