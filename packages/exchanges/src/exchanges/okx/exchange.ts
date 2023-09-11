import {
  ExchangeCode,
  IAccountAsset,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  ICandlestick,
  IGetCandlesticksRequest,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IGetMarketPriceRequest,
  IGetMarketPriceResponse,
  IGetSymbolInfoRequest,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  ISymbolInfo,
  ITradingPairSymbolRequest,
} from "@bifrost/types";
import ccxt, { Dictionary, Market, okex5, Order } from "ccxt";
import { IExchangeCredentials } from "src/types/exchange-credentials.interface";
import { IExchange } from "src/types/exchange.interface";
import { getCachedMarkets, cacheMarkets } from "../state";
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
    this.ccxt = new ccxt.okex5(ccxtCredentials);

    if (credentials?.isDemoAccount) {
      this.ccxt.setSandboxMode(true);
    }

    const cachedMarkets = getCachedMarkets(ExchangeCode.OKX);
    if (cachedMarkets) {
      this.ccxt.markets = cachedMarkets;
    }
  }

  async loadMarkets(): Promise<Dictionary<Market>> {
    const markets = await this.ccxt.loadMarkets();

    cacheMarkets(markets, ExchangeCode.OKX);

    return markets;
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
    const args = normalize.getSymbol.request(params);
    // method market() not typed by CCXT
    const data: Market = await this.ccxt.market(...args);

    return normalize.getSymbol.response(data);
  }

  async getSymbols(): Promise<ISymbolInfo[]> {
    const markets = await this.ccxt.loadMarkets();

    return normalize.getSymbols.response(markets);
  }

  /**
   * OKx uses the `BTC-USDT` format for annotating trading pairs
   */
  tradingPairSymbol(params: ITradingPairSymbolRequest): string {
    const { baseCurrency, quoteCurrency } = params;

    return `${baseCurrency}-${quoteCurrency}`;
  }
}
