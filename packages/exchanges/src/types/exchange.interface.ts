import {
  IAccountAsset,
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
  IGetFilledLimitOrdersResponse,
  IGetFilledLimitOrdersRequest,
  IGetCanceledLimitOrdersRequest,
  IGetCanceledLimitOrdersResponse,
} from "@bifrost/types";
import { Dictionary, Market, okex5 } from "ccxt";

export interface IExchange {
  ccxt: okex5;

  loadMarkets(): Promise<Dictionary<Market>>; // forward to `ccxt.loadMarkets`

  accountAssets(): Promise<IAccountAsset[]>;
  getLimitOrder(body: IGetLimitOrderRequest): Promise<IGetLimitOrderResponse>;
  placeLimitOrder(
    body: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse>;
  cancelLimitOrder(
    body: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse>;
  getFilledLimitOrders(
    body: IGetFilledLimitOrdersRequest,
  ): Promise<IGetFilledLimitOrdersResponse>;
  getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse>;
  getCandlesticks(params: IGetCandlesticksRequest): Promise<ICandlestick[]>;
  getSymbols(): Promise<ISymbolInfo[]>;
  getSymbol(params: IGetSymbolInfoRequest): Promise<ISymbolInfo>;
  tradingPairSymbol(params: ITradingPairSymbolRequest): string;
}
