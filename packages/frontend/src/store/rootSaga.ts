import { all } from "redux-saga/effects";

import { watchTodo } from "src/store/todo/saga";

function* rootSaga() {
  yield all([watchTodo()]);
}

export default rootSaga;
