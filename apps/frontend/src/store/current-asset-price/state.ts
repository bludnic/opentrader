import { FetchStatus } from "src/utils/redux/types";

export interface CurrentAssetPriceState {
  currentAssetPrice: number;
  timestamp: number;
  status: FetchStatus;
  err: Error | null;
}

export const initialState: CurrentAssetPriceState = {
  currentAssetPrice: 0,
  timestamp: 0,
  status: FetchStatus.Idle,
  err: null,
};
