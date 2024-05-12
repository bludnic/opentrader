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
  ExchangeCode,
  IWatchCandlesRequest,
} from "@opentrader/types";
import type { Dictionary, Market, Exchange } from "ccxt";

export interface IExchange {
  ccxt: Exchange;
  exchangeCode: ExchangeCode;

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
  watchOrders: (params?: IWatchOrdersRequest) => Promise<IWatchOrdersResponse>;
  watchCandles: (symbol: IWatchCandlesRequest) => Promise<ICandlestick[]>;
}
