import { createAction } from "@reduxjs/toolkit";
import { ExchangeAccountDto } from "src/lib/bifrost/client";

export const fetchExchangeAccountsAction = createAction(
  "fetchExchangeAccounts"
);
export const fetchExchangeAccountsSucceededAction = createAction<
  ExchangeAccountDto[],
  "fetchExchangeAccountsSucceeded"
>("fetchExchangeAccountsSucceeded");

export const fetchExchangeAccountsFailedAction = createAction<
  Error,
  "fetchExchangeAccountsFailed"
>("fetchExchangeAccountsFailed");
