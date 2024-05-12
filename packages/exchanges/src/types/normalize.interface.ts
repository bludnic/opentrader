import type {
  IAccountAsset,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  ICandlestick,
  IGetCandlesticksRequest,
  IGetOpenOrdersRequest,
  IGetOpenOrdersResponse,
  IGetClosedOrdersRequest,
  IGetClosedOrdersResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  IGetSymbolInfoRequest,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  ISymbolInfo,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
  IPlaceStopOrderRequest,
  IPlaceStopOrderResponse,
  IWatchCandlesRequest,
  IWatchCandlesResponse,
} from "@opentrader/types";
import type {
  Balances,
  Exchange,
  Order,
  Dictionary,
  Market,
  OHLCV,
  Ticker,
} from "ccxt";

export type Normalize = {
  accountAssets: {
    // request: () => Parameters<Exchange["fetchBalance"]>;
    response: (data: Balances) => IAccountAsset[];
  };

  getLimitOrder: {
    request: (
      params: IGetLimitOrderRequest,
    ) => Parameters<Exchange["fetchOrder"]>;
    response: (data: Order) => IGetLimitOrderResponse;
  };

  placeLimitOrder: {
    request: (
      params: IPlaceLimitOrderRequest,
    ) => Parameters<Exchange["createLimitOrder"]>;
    response: (data: Order) => IPlaceLimitOrderResponse;
  };

  placeStopOrder: {
    request: (
      params: IPlaceStopOrderRequest,
    ) => Parameters<Exchange["createStopOrder"]>;
    response: (data: Order) => IPlaceStopOrderResponse;
  };

  cancelLimitOrder: {
    request: (
      params: ICancelLimitOrderRequest,
    ) => Parameters<Exchange["cancelOrder"]>;
    // data is not typed by `ccxt`
    // so add type manually
    response: (
      data: Pick<Order, "id" | "clientOrderId">,
    ) => ICancelLimitOrderResponse;
  };

  getOpenOrders: {
    request: (
      params: IGetOpenOrdersRequest,
    ) => Parameters<Exchange["fetchOpenOrders"]>;
    response: (data: Order[]) => IGetOpenOrdersResponse;
  };

  getClosedOrders: {
    request: (
      params: IGetClosedOrdersRequest,
    ) => Parameters<Exchange["fetchClosedOrders"]>;
    response: (data: Order[]) => IGetClosedOrdersResponse;
  };

  getMarketPrice: {
    request: (
      params: IGetMarketPriceRequest,
    ) => Parameters<Exchange["fetchTicker"]>;
    response: (data: Ticker) => IGetMarketPriceResponse;
  };

  getCandlesticks: {
    request: (
      params: IGetCandlesticksRequest,
    ) => Parameters<Exchange["fetchOHLCV"]>;
    response: (data: OHLCV[]) => ICandlestick[];
  };

  getSymbol: {
    request: (params: IGetSymbolInfoRequest) => Parameters<Exchange["market"]>;
    response: (data: Market) => ISymbolInfo;
  };

  getSymbols: {
    // request: (params: never) => void; // no params
    response: (data: Dictionary<Market>) => ISymbolInfo[];
  };

  watchOrders: {
    request: (
      params: IWatchOrdersRequest,
    ) => Parameters<Exchange["watchOrders"]>;
    response: (data: Order[]) => IWatchOrdersResponse;
  };

  watchCandles: {
    request: (
      params: IWatchCandlesRequest,
    ) => Parameters<Exchange["watchOHLCV"]>;
    response: (data: OHLCV[]) => IWatchCandlesResponse;
  };
};
