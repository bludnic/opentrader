import {
  IAccountAsset,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  ICandlestick,
  IGetCanceledLimitOrdersRequest,
  IGetCanceledLimitOrdersResponse,
  IGetCandlesticksRequest,
  IGetFilledLimitOrdersRequest,
  IGetFilledLimitOrdersResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  IGetSymbolInfoRequest,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  ISymbolInfo,
} from "@bifrost/types";
import {
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

  getFilledLimitOrders: {
    request: (
      params: IGetFilledLimitOrdersRequest,
    ) => Parameters<Exchange["fetchClosedOrders"]>;
    response: (data: Order[]) => IGetFilledLimitOrdersResponse;
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
};
