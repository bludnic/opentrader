import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { FetchStatus } from "src/utils/redux/types";
import {
  fetchExchangeAccountsAction,
  fetchExchangeAccountsSucceededAction,
  fetchExchangeAccountsFailedAction,
} from "./actions";
import { initialState } from "./state";

export const exchangeAccountsSlice = createSlice({
  name: "exchangeAccounts",
  initialState,
  reducers: {
    [fetchExchangeAccountsAction.type]: (state) => {
      state.status = FetchStatus.Loading;
      state.err = null;
    },
    [fetchExchangeAccountsSucceededAction.type]: (
      state,
      action: PayloadAction<ExchangeAccountDto[]>
    ) => {
      state.status = FetchStatus.Succeeded;
      state.exchangeAccounts = action.payload;
    },
    [fetchExchangeAccountsFailedAction.type]: (
      state,
      action: PayloadAction<Error>
    ) => {
      state.status = FetchStatus.Error;
      state.err = action.payload;
    },
  },
});

export const {
  fetchExchangeAccounts,
  fetchExchangeAccountsSucceeded,
  fetchExchangeAccountsFailed,
} = exchangeAccountsSlice.actions;
