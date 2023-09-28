import { ExchangeAccountDto } from "src/lib/bifrost/client";
import { FetchStatus } from "src/utils/redux/types";

export interface ExchangeAccountsState {
  exchangeAccounts: ExchangeAccountDto[];
  status: FetchStatus;
  err: Error | null;
}

export const initialState: ExchangeAccountsState = {
  exchangeAccounts: [],
  status: FetchStatus.Idle,
  err: null,
};
