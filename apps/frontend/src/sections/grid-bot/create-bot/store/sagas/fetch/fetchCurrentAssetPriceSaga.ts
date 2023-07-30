import { AxiosResponse } from "axios";
import { call, put } from "redux-saga/effects";
import { bifrostApi } from "src/lib/bifrost/apiClient";
import {
  GetCurrentAssetPriceResponseDto,
  SymbolInfoDto,
} from "src/lib/bifrost/client";
import { fetchCurrentAssetPrice, fetchCurrentAssetPriceSucceeded } from 'src/store/current-asset-price';

export function* fetchCurrentAssetPriceSaga(symbol: SymbolInfoDto) {
  yield put(
    fetchCurrentAssetPrice({
      symbolId: symbol.symbolId,
    })
  );

  const {
    data: currentAssetPriceData,
  }: AxiosResponse<GetCurrentAssetPriceResponseDto> = yield call(
    bifrostApi.getCurrentAssetPrice,
    symbol.symbolId
  );

  yield put(fetchCurrentAssetPriceSucceeded(currentAssetPriceData));

  return {
    currentAssetPrice: currentAssetPriceData.price,
  };
}
