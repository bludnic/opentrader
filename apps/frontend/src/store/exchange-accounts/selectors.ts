import { Selector } from "@reduxjs/toolkit";
import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { ExchangeAccountsState } from "src/store/exchange-accounts/state";
import { RootState } from "src/store/index";

export const selectExchangeAccountsState: Selector<
  RootState,
  ExchangeAccountsState
> = (rootState) => rootState.exchangeAccounts;

export const selectExchangeAccounts: Selector<
  RootState,
  ExchangeAccountDto[]
> = (rootState) => rootState.exchangeAccounts.exchangeAccounts;
