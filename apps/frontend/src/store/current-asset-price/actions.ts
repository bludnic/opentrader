import { createAction } from "@reduxjs/toolkit";
import { GetCurrentAssetPriceResponseDto } from "src/lib/bifrost/client";

export type FetchCurrentAssetPriceActionPayload = {
  symbolId: string;
};

const FETCH_CURRENT_ASSET_PRICE = "fetchCurrentAssetPrice";
export const fetchCurrentAssetPriceAction = createAction<
  FetchCurrentAssetPriceActionPayload,
  typeof FETCH_CURRENT_ASSET_PRICE
>(FETCH_CURRENT_ASSET_PRICE);

export const fetchCurrentAssetPriceSucceededAction = createAction<
  GetCurrentAssetPriceResponseDto,
  "fetchCurrentAssetPriceSucceeded"
>("fetchCurrentAssetPriceSucceeded");

export const fetchCurrentAssetPriceFailedAction = createAction<
  Error,
  "fetchCurrentAssetPriceFailed"
>("fetchCurrentAssetPriceFailed");
