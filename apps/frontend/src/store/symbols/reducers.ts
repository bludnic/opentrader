import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SymbolInfoDto } from 'src/lib/bifrost/client';
import { FetchStatus } from "src/utils/redux/types";
import {
  fetchSymbolsAction,
  fetchSymbolsSucceededAction,
  fetchSymbolsFailedAction,
} from "./actions";
import { initialState } from "./state";

export const symbolsSlice = createSlice({
  name: "symbols",
  initialState,
  reducers: {
    [fetchSymbolsAction.type]: (state) => {
      state.status = FetchStatus.Loading;
      state.err = null;
    },
    [fetchSymbolsSucceededAction.type]: (
      state,
      action: PayloadAction<SymbolInfoDto[]>
    ) => {
      state.status = FetchStatus.Succeeded;
      state.symbols = action.payload;
    },
    [fetchSymbolsFailedAction.type]: (state, action: PayloadAction<Error>) => {
      state.status = FetchStatus.Error;
      state.err = action.payload;
    },
  },
});

export const { fetchSymbols, fetchSymbolsSucceeded, fetchSymbolsFailed } =
  symbolsSlice.actions;
