import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { Task } from "redux-saga";
import { Store } from "redux";
import { createWrapper, Context } from "next-redux-wrapper";
import { marketsApi } from "src/lib/markets/marketsApi";
import {
  createGridBotSlice,
  CreateGridBotState,
} from "src/sections/grid-bot/create-bot/store/create-bot";
import { gridBotInitPageSlice } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { CreateGridBotPageInitState } from "src/sections/grid-bot/create-bot/store/init-page/state";
import {
  gridBotFormSlice,
  GridBotFormState,
} from "src/sections/grid-bot/create-bot/store/bot-form";

import rootSaga from "./rootSaga";
import {
  backtestingFormSlice,
  BacktestingFormState,
} from "src/sections/grid-bot/create-bot/store/backtesting-form";

export type RootState = {
  gridBotForm: GridBotFormState;
  gridBotInitPage: CreateGridBotPageInitState;
  createGridBot: CreateGridBotState;
  backtestingForm: BacktestingFormState;
  [marketsApi.reducerPath]: ReturnType<typeof marketsApi.reducer>;
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
      gridBotForm: gridBotFormSlice.reducer,
      gridBotInitPage: gridBotInitPageSlice.reducer,
      createGridBot: createGridBotSlice.reducer,
      marketsApi: marketsApi.reducer,
      backtestingForm: backtestingFormSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(sagaMiddleware)
        .concat(marketsApi.middleware),
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
