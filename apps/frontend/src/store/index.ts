import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { Task } from "redux-saga";
import { Store } from "redux";
import { createWrapper, Context } from "next-redux-wrapper";
import { threeCommasAccountsApi } from "src/sections/3commas-accounts/common/store/api";
import { gridBotCompletedSmartTradesApi } from "src/sections/grid-bot/common/store/api/completedDealsApi";
import {
  createGridBotSlice,
  CreateGridBotState,
} from "src/sections/grid-bot/create-bot/store/create-bot";
import { gridBotInitPageSlice } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { CreateGridBotPageInitState } from "src/sections/grid-bot/create-bot/store/init-page/state";
import { rtkApi } from "src/lib/bifrost/rtkApi";
import { candlesticksSlice, CandlesticksState } from "src/store/candlesticks";
import {
  currentAssetPriceSlice,
  CurrentAssetPriceState,
} from "src/store/current-asset-price";
import { candlesticksHistoryApi } from "src/sections/grid-bot/common/store/api/candlesticksHistoryApi";
import {
  gridBotFormSlice,
  GridBotFormState,
} from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  exchangeAccountsSlice,
  ExchangeAccountsState,
} from "src/store/exchange-accounts";

import rootSaga from "./rootSaga";
import { todoReducer, TodoState } from "src/store/todo";
import {
  backtestingFormSlice,
  BacktestingFormState,
} from "src/sections/grid-bot/create-bot/store/backtesting-form";

export type RootState = {
  todo: TodoState;
  gridBotForm: GridBotFormState;
  gridBotInitPage: CreateGridBotPageInitState;
  createGridBot: CreateGridBotState;
  backtestingForm: BacktestingFormState;
  exchangeAccounts: ExchangeAccountsState;
  currentAssetPrice: CurrentAssetPriceState;
  candlesticks: CandlesticksState;
  [gridBotCompletedSmartTradesApi.reducerPath]: ReturnType<
    typeof gridBotCompletedSmartTradesApi.reducer
  >;
  [threeCommasAccountsApi.reducerPath]: ReturnType<
    typeof threeCommasAccountsApi.reducer
  >;
  [candlesticksHistoryApi.reducerPath]: ReturnType<
    typeof candlesticksHistoryApi.reducer
  >;
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;
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
      gridBotForm: gridBotFormSlice.reducer,
      gridBotInitPage: gridBotInitPageSlice.reducer,
      createGridBot: createGridBotSlice.reducer,
      exchangeAccounts: exchangeAccountsSlice.reducer,
      currentAssetPrice: currentAssetPriceSlice.reducer,
      candlesticks: candlesticksSlice.reducer,
      gridBotCompletedSmartTradesApi: gridBotCompletedSmartTradesApi.reducer,
      threeCommasAccountsApi: threeCommasAccountsApi.reducer,
      candlesticksHistoryApi: candlesticksHistoryApi.reducer,
      rtkApi: rtkApi.reducer,
      backtestingForm: backtestingFormSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(sagaMiddleware)
        .concat(gridBotCompletedSmartTradesApi.middleware)
        .concat(threeCommasAccountsApi.middleware)
        .concat(candlesticksHistoryApi.middleware)
        .concat(rtkApi.middleware),
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
