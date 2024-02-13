import type { IExchange } from "@opentrader/exchanges";
import type {
  IAccountAsset,
  IGetTradingFeeRatesRequest,
  IGetTradingFeeRatesResponse,
  ITradingPairSymbolRequest,
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
  IGetSymbolInfoRequest,
  ISymbolInfo,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
  IPlaceStopOrderRequest,
  IPlaceStopOrderResponse,
} from "@opentrader/types";
import { ExchangeCode } from "@opentrader/types";
import type { MarketSimulator } from "../market-simulator";

export class MemoryExchange implements IExchange {
  ccxt = {} as any;
  /**
   * @internal
   */
  constructor(private marketSimulator: MarketSimulator) {}

  async loadMarkets() {
    return {};
  }

  async accountAssets(): Promise<IAccountAsset[]> {
    return [];
  }

  async getLimitOrder(
    _body: IGetLimitOrderRequest,
  ): Promise<IGetLimitOrderResponse> {
    return {
      exchangeOrderId: "",
      clientOrderId: "",
      price: 0,
      quantity: 1,
      side: "buy",
      status: "filled",
      fee: 0,
      createdAt: 0,
      lastTradeTimestamp: 0,
      filledPrice: null,
    };
  }

  async placeLimitOrder(
    _body: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse> {
    return {
      orderId: "",
      clientOrderId: "",
    };
  }

  async placeStopOrder(
    _body: IPlaceStopOrderRequest,
  ): Promise<IPlaceStopOrderResponse> {
    return {
      orderId: "",
      clientOrderId: "",
    };
  }

  async cancelLimitOrder(
    _body: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse> {
    return {
      orderId: "",
    };
  }

  async getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse> {
    const candlestick = this.marketSimulator.currentCandle;
    const assetPrice = candlestick.close;
    const { symbol } = params;

    return {
      symbol,
      price: assetPrice,
      timestamp: 0,
    };
  }

  async getCandlesticks(
    _params: IGetCandlesticksRequest,
  ): Promise<ICandlestick[]> {
    return [];
  }

  async getTradingFeeRates(
    _params: IGetTradingFeeRatesRequest,
  ): Promise<IGetTradingFeeRatesResponse> {
    return {
      makerFee: 0,
      takerFee: 0,
    };
  }

  async getSymbol(_params: IGetSymbolInfoRequest): Promise<ISymbolInfo> {
    return {
      symbolId: `${ExchangeCode.OKX}:ADA/USDT`,
      currencyPair: "ADA/USDT",
      exchangeCode: ExchangeCode.OKX,
      exchangeSymbolId: "ADA-USDT",
      baseCurrency: "ADA",
      quoteCurrency: "USDT",
      filters: {
        price: {
          minPrice: "0.0001",
          tickSize: "0.0001",
          maxPrice: "100000",
        },
        lot: {
          minQuantity: "1",
          stepSize: "1",
          maxQuantity: "10000",
        },
      },
    };
  }

  async getSymbols(): Promise<ISymbolInfo[]> {
    return [];
  }

  async getOpenOrders() {
    return [];
  }

  async getClosedOrders() {
    return [];
  }

  async watchOrders(
    _params?: IWatchOrdersRequest,
  ): Promise<IWatchOrdersResponse> {
    throw new Error(
      "Not implemented. Backtesting doesn't require this method.",
    );
  }

  tradingPairSymbol(params: ITradingPairSymbolRequest) {
    return `${params.baseCurrency}-${params.quoteCurrency}`;
  }
}
