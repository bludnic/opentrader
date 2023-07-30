import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetCurrentAssetPriceResponseDto } from "src/lib/bifrost/client";
import { FetchStatus } from "src/utils/redux/types";
import {
  fetchCurrentAssetPriceAction,
  fetchCurrentAssetPriceSucceededAction,
  fetchCurrentAssetPriceFailedAction,
  FetchCurrentAssetPriceActionPayload,
} from "./actions";
import { initialState } from "./state";

export const currentAssetPriceSlice = createSlice({
  name: "currentAssetPrice",
  initialState,
  reducers: {
    [fetchCurrentAssetPriceAction.type]: (
      state,
      payload: PayloadAction<FetchCurrentAssetPriceActionPayload>
    ) => {
      state.status = FetchStatus.Loading;
      state.err = null;
    },
    [fetchCurrentAssetPriceSucceededAction.type]: (
      state,
      action: PayloadAction<GetCurrentAssetPriceResponseDto>
    ) => {
      state.status = FetchStatus.Succeeded;
      state.currentAssetPrice = action.payload.price;
      state.timestamp = action.payload.timestamp;
    },
    [fetchCurrentAssetPriceFailedAction.type]: (
      state,
      action: PayloadAction<Error>
    ) => {
      state.status = FetchStatus.Error;
      state.err = action.payload;
    },
  },
});

export const {
  fetchCurrentAssetPrice,
  fetchCurrentAssetPriceSucceeded,
  fetchCurrentAssetPriceFailed,
} = currentAssetPriceSlice.actions;
