import { all } from "redux-saga/effects";
import { createGridBotSagas } from 'src/sections/grid-bot/create-bot/store/sagas';
import { requestCandlesticksWatcher } from 'src/store/candlesticks/saga';

import { watchTodo } from "src/store/todo/saga";

function* rootSaga() {
  yield all([
    watchTodo(),
    // fetchExchangeAccountsWatcher(),
    // fetchSymbolsWatcher(),
    requestCandlesticksWatcher(),
    // fetchCurrentAssetPriceWatcher(),
    createGridBotSagas(),
  ]);
}

export default rootSaga;
