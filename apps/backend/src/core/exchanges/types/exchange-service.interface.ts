import {
  IAccountAsset,
  IGetTradingFeeRatesRequest,
  IGetTradingFeeRatesResponse,
  IGetCandlesticksRequest,
  ICandlestick,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  ITradingPairSymbolRequest,
  ISymbolInfo,
  IGetSymbolInfoRequest,
} from '@bifrost/types';

export interface IExchangeService {
  accountAssets(): Promise<IAccountAsset[]>;
  getLimitOrder(body: IGetLimitOrderRequest): Promise<IGetLimitOrderResponse>;
  placeLimitOrder(
    body: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse>;
  cancelLimitOrder(
    body: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse>;
  getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse>;
  getCandlesticks(params: IGetCandlesticksRequest): Promise<ICandlestick[]>;
  getTradingFeeRates(
    params: IGetTradingFeeRatesRequest,
  ): Promise<IGetTradingFeeRatesResponse>;
  getSymbols(params: IGetSymbolInfoRequest): Promise<ISymbolInfo[]>;
  tradingPairSymbol(params: ITradingPairSymbolRequest): string;
}
