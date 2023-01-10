import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { Task } from "redux-saga";
import { Store } from "redux";
import { createWrapper, Context } from "next-redux-wrapper";
import { threeCommasAccountsApi } from 'src/sections/3commas-accounts/common/store/api';
import { exchangeAccountsApi } from 'src/sections/exchange-accounts/common/store/api';
import { gridBotsApi } from "src/sections/grid-bot/common/store/api";

import rootSaga from "./rootSaga";
import { todoReducer, TodoState } from "src/store/todo";

export type RootState = {
  todo: TodoState;
  [gridBotsApi.reducerPath]: ReturnType<typeof gridBotsApi.reducer>;
  [exchangeAccountsApi.reducerPath]: ReturnType<typeof exchangeAccountsApi.reducer>;
  [threeCommasAccountsApi.reducerPath]: ReturnType<typeof threeCommasAccountsApi.reducer>;
};

export interface SagaStore extends Store<RootState> {
  sagaTask: Task;
}

const makeStore = (context: Context) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Add an extra parameter for applying middleware:
  const store = configureStore({
    reducer: {
      todo: todoReducer,
      gridBotsApi: gridBotsApi.reducer,
      exchangeAccountsApi: exchangeAccountsApi.reducer,
      threeCommasAccountsApi: threeCommasAccountsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(sagaMiddleware),
    devTools: true,
  });

  // 3: Run your sagas on server
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  // 4: now return the store:
  return store;
};
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

// export an assembled wrapper
export const wrapper = createWrapper<Store<RootState>>(makeStore, {
  debug: process.env.NODE_ENV === "development",
});
