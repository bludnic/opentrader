import { CandlestickEntity } from "src/lib/bifrost/client";
import { FetchStatus } from "src/utils/redux/types";

export interface CandlesticksState {
  candlesticks: CandlestickEntity[];
  status: FetchStatus;
  err: Error | null;
}

export const initialState: CandlesticksState = {
  candlesticks: [],
  status: FetchStatus.Idle,
  err: null,
};
