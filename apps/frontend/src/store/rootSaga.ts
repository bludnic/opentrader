import { all } from "redux-saga/effects";
import { createGridBotSagas } from 'src/sections/grid-bot/create-bot/store/sagas';

function* rootSaga() {
  yield all([
    createGridBotSagas(),
  ]);
}

export default rootSaga;
