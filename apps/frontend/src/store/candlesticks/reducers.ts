import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CandlestickEntity } from "src/lib/bifrost/client";
import { FetchStatus } from "src/utils/redux/types";
import {
  fetchCandlesticksAction,
  fetchCandlesticksSucceededAction,
  fetchCandlesticksFailedAction,
  FetchCandlesticksActionPayload,
  requestCandlesticksAction,
  RequestCandlesticksActionPayload,
} from "./actions";
import { initialState } from "./state";

export const candlesticksSlice = createSlice({
  name: "candlesticks",
  initialState,
  reducers: {
    [requestCandlesticksAction.type]: (
      state,
      payload: PayloadAction<RequestCandlesticksActionPayload>
    ) => {},
    [fetchCandlesticksAction.type]: (
      state,
      payload: PayloadAction<FetchCandlesticksActionPayload>
    ) => {
      state.status = FetchStatus.Loading;
      state.err = null;
    },
    [fetchCandlesticksSucceededAction.type]: (
      state,
      action: PayloadAction<CandlestickEntity[]>
    ) => {
      state.status = FetchStatus.Succeeded;
      state.candlesticks = action.payload;
    },
    [fetchCandlesticksFailedAction.type]: (
      state,
      action: PayloadAction<Error>
    ) => {
      state.status = FetchStatus.Error;
      state.err = action.payload;
    },
  },
});

export const {
  requestCandlesticks,
  fetchCandlesticks,
  fetchCandlesticksSucceeded,
  fetchCandlesticksFailed,
} = candlesticksSlice.actions;
