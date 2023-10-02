import { all } from "redux-saga/effects";
import { createGridBotSagas } from 'src/sections/grid-bot/create-bot/store/sagas';

import { watchTodo } from "src/store/todo/saga";

function* rootSaga() {
  yield all([
    watchTodo(),
    // fetchExchangeAccountsWatcher(),
    // fetchSymbolsWatcher(),
    // fetchCurrentAssetPriceWatcher(),
    createGridBotSagas(),
  ]);
}

export default rootSaga;
