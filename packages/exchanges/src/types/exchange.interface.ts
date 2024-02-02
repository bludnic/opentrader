import type {
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
  IGetOpenOrdersRequest,
  IGetOpenOrdersResponse,
  IGetClosedOrdersRequest,
  IGetClosedOrdersResponse,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
  IPlaceStopOrderRequest,
  IPlaceStopOrderResponse,
} from "@opentrader/types";
import type { Dictionary, Market, okex5 } from "ccxt";

export interface IExchange {
  ccxt: okex5;

  loadMarkets: () => Promise<Dictionary<Market>>; // forward to `ccxt.loadMarkets`

  accountAssets: () => Promise<IAccountAsset[]>;
  getLimitOrder: (
    body: IGetLimitOrderRequest,
  ) => Promise<IGetLimitOrderResponse>;
  placeLimitOrder: (
    body: IPlaceLimitOrderRequest,
  ) => Promise<IPlaceLimitOrderResponse>;
  cancelLimitOrder: (
    body: ICancelLimitOrderRequest,
  ) => Promise<ICancelLimitOrderResponse>;
  placeStopOrder: (
    body: IPlaceStopOrderRequest,
  ) => Promise<IPlaceStopOrderResponse>;
  getOpenOrders: (
    body: IGetOpenOrdersRequest,
  ) => Promise<IGetOpenOrdersResponse>;
  getClosedOrders: (
    body: IGetClosedOrdersRequest,
  ) => Promise<IGetClosedOrdersResponse>;
  getMarketPrice: (
    params: IGetMarketPriceRequest,
  ) => Promise<IGetMarketPriceResponse>;
  getCandlesticks: (params: IGetCandlesticksRequest) => Promise<ICandlestick[]>;
  getSymbols: () => Promise<ISymbolInfo[]>;
  getSymbol: (params: IGetSymbolInfoRequest) => Promise<ISymbolInfo>;
  tradingPairSymbol: (params: ITradingPairSymbolRequest) => string;
  watchOrders: (params?: IWatchOrdersRequest) => Promise<IWatchOrdersResponse>;
}
