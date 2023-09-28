import { Selector } from "@reduxjs/toolkit";
import { CurrentAssetPriceState } from "src/store/current-asset-price/state";
import { RootState } from "src/store/index";

export const selectCurrentAssetPriceState: Selector<
  RootState,
  CurrentAssetPriceState
> = (rootState) => rootState.currentAssetPrice;

export const selectCurrentAssetPrice: Selector<RootState, number> = (
  rootState
) => rootState.currentAssetPrice.currentAssetPrice;
