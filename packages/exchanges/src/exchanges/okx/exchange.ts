import type {
  IAccountAsset,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  ICandlestick,
  IGetCandlesticksRequest,
  IGetClosedOrdersRequest,
  IGetClosedOrdersResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  IGetOpenOrdersRequest,
  IGetOpenOrdersResponse,
  IGetSymbolInfoRequest,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  IPlaceOCOOrderRequest,
  IPlaceOCOOrderResponse,
  IPlaceStopLimitOrderRequest,
  IPlaceStopLimitOrderResponse,
  IPlaceStopMarketOrderRequest,
  IPlaceStopMarketOrderResponse,
  IPlaceStopOrderRequest,
  IPlaceStopOrderResponse,
  ISymbolInfo,
  ITradingPairSymbolRequest,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
} from "@opentrader/types";
import { ExchangeCode } from "@opentrader/types";
import type { Dictionary, Market, okex5 } from "ccxt";
import { pro } from "ccxt";
import type { IExchangeCredentials } from "#exchanges/types/exchange-credentials.interface";
import type { IExchange } from "#exchanges/types/exchange.interface";
import { cache } from "../../cache";
import { fetcher } from "../../utils/next/fetcher";
import { normalize } from "./normalize";

export class OkxExchange implements IExchange {
  public ccxt: okex5;

  constructor(credentials?: IExchangeCredentials) {
    const ccxtCredentials = credentials
      ? {
          apiKey: credentials.apiKey,
          secret: credentials.secretKey,
          password: credentials.password,
        }
      : undefined;
    this.ccxt = new pro.okx(ccxtCredentials);
    // this.ccxt.verbose = true;

    this.ccxt.fetchImplementation = fetcher; // #57
    // #88 Fixes: 'e instanceof this.AbortError' is not an object
    this.ccxt.FetchError = TypeError; // when fetch request failed (network error)
    this.ccxt.AbortError = DOMException; // when fetch request aborted

    if (credentials?.isDemoAccount) {
      this.ccxt.setSandboxMode(true);
    }
  }

  async loadMarkets(): Promise<Dictionary<Market>> {
    const cacheProvider = cache.getCacheProvider();
    return cacheProvider.getMarkets(ExchangeCode.OKX, this.ccxt);
  }

  async accountAssets(): Promise<IAccountAsset[]> {
    const data = await this.ccxt.fetchBalance();

    return normalize.accountAssets.response(data);
  }

  async getLimitOrder(
    params: IGetLimitOrderRequest,
  ): Promise<IGetLimitOrderResponse> {
    const args = normalize.getLimitOrder.request(params);
    const data = await this.ccxt.fetchOrder(...args);

    return normalize.getLimitOrder.response(data);
  }

  async getAlgoOrder(params: any) {
    return this.ccxt.privateGetTradeOrderAlgo({
      algoId: params.orderId,
    });
  }

  async createOrder(params: any) {
    return this.ccxt.createOrder('ETH/USDT', 'limit', 'buy', 0.05, 2297, {
      'stopLoss': {
        'type': 'limit', // or 'market', this field is not necessary if limit price is specified
        'price': 1900, // limit price for a limit stop loss order
        'triggerPrice': 2000,
      },
      'takeProfit': {
        'type': 'market', // or 'limit', this field is not necessary if limit price is specified
        // no limit price for a market take profit order
        // 'price': 160.33, // this field is not necessary for a market take profit order
        'triggerPrice': 2500,
      }
    });
  }

  async placeLimitOrder(
    params: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse> {
    if ("clientOrderId" in params) {
      throw new Error(
        "Fetch limit order by `clientOrderId` is not supported yet",
      );
    }

    const args = normalize.placeLimitOrder.request(params);
    const data = await this.ccxt.createLimitOrder(...args);

    return normalize.placeLimitOrder.response(data);
  }

  async placeStopOrder(
    params: IPlaceStopOrderRequest,
  ): Promise<IPlaceStopOrderResponse> {
    if (params.type === "limit") {
      return this.placeStopLimitOrder(params);
    } else {
      return this.placeStopMarketOrder(params);
    }
  }

  async placeStopLimitOrder(
    params: IPlaceStopLimitOrderRequest,
  ): Promise<IPlaceStopLimitOrderResponse> {
    // instId: "ETH-USDT",
    // side: "buy",
    // ordType: "conditional",
    // sz: "0.01",
    // tdMode: "cash",
    // tgtCcy: "base_ccy",
    // tpTriggerPx: "2200",
    // tpOrdPx: "2300",
    // slTriggerPx: "2400",
    // slOrdPx: "2500",
    const args = normalize.placeStopLimitOrder.request(params);
    const data = await this.ccxt.privatePostTradeOrderAlgo(args);

    return normalize.placeStopLimitOrder.response(data);
  }

  async placeStopMarketOrder(
    params: IPlaceStopMarketOrderRequest,
  ): Promise<IPlaceStopMarketOrderResponse> {
    // instId: "ETH-USDT",
    // side: "buy",
    // ordType: "conditional",
    // sz: "0.01",
    // tdMode: "cash",
    // tgtCcy: "base_ccy",
    // tpTriggerPx: "2200",
    // tpOrdPx: "2300",
    // slTriggerPx: "2400",
    // slOrdPx: "2500",
    const args = normalize.placeStopMarketOrder.request(params);
    console.log(args);
    const data = await this.ccxt.privatePostTradeOrderAlgo(args);

    return normalize.placeStopMarketOrder.response(data);
  }

  async placeOCOOrder(
    params: IPlaceOCOOrderRequest,
  ): Promise<IPlaceOCOOrderResponse> {
    const args = normalize.placeOCOOrder.request(params);
    console.log(args);
    const data = await this.ccxt.privatePostTradeOrderAlgo(args);

    return normalize.placeOCOOrder.response(data);
  }

  async getOpenOrders(
    params: IGetOpenOrdersRequest,
  ): Promise<IGetOpenOrdersResponse> {
    const args = normalize.getOpenOrders.request(params);
    const data = await this.ccxt.fetchOpenOrders(...args);

    return normalize.getOpenOrders.response(data);
  }

  async getClosedOrders(
    params: IGetClosedOrdersRequest,
  ): Promise<IGetClosedOrdersResponse> {
    const args = normalize.getClosedOrders.request(params);
    const data = await this.ccxt.fetchClosedOrders(...args);

    return normalize.getClosedOrders.response(data);
  }

  async cancelLimitOrder(
    params: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse> {
    const args = normalize.cancelLimitOrder.request(params);
    // The response is not typed properly.
    // Probably cause not all exchanges
    // return `orderId` in the response
    await this.ccxt.cancelOrder(...args);

    return {
      orderId: params.orderId,
    };
  }

  async getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse> {
    const args = normalize.getMarketPrice.request(params);
    const data = await this.ccxt.fetchTicker(...args);

    return normalize.getMarketPrice.response(data);
  }

  async getCandlesticks(
    params: IGetCandlesticksRequest,
  ): Promise<ICandlestick[]> {
    const args = normalize.getCandlesticks.request(params);
    const data = await this.ccxt.fetchOHLCV(...args);

    return normalize.getCandlesticks.response(data);
  }

  async getSymbol(params: IGetSymbolInfoRequest): Promise<ISymbolInfo> {
    const markets = await this.loadMarkets();

    const args = normalize.getSymbol.request(params);
    // method market() not typed by CCXT
    // const data: Market = await this.ccxt.market(...args);
    const data: Market = markets[args[0]];

    return normalize.getSymbol.response(data); // @todo refactor
  }

  async getSymbols(
    type: "spot" | "future" | "option" | "swap" = "spot",
  ): Promise<ISymbolInfo[]> {
    const markets = await this.loadMarkets();

    const spotMarkets = Object.entries(markets)
      .filter(([_currency, market]) => market.type === type)
      .reduce<Dictionary<Market>>((acc, [currency, market]) => {
        return {
          ...acc,
          [currency]: market,
        };
      }, {});

    return normalize.getSymbols.response(spotMarkets);
  }

  /**
   * OKx uses the `BTC-USDT` format for annotating trading pairs
   */
  tradingPairSymbol(params: ITradingPairSymbolRequest): string {
    const { baseCurrency, quoteCurrency } = params;

    return `${baseCurrency}-${quoteCurrency}`;
  }

  async watchOrders(
    params: IWatchOrdersRequest = {},
  ): Promise<IWatchOrdersResponse> {
    const args = normalize.watchOrders.request(params);
    const data = await this.ccxt.watchOrders(...args);

    return normalize.watchOrders.response(data);
  }
}
