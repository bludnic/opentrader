/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
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
  IPlaceStopOrderRequest,
  IPlaceStopOrderResponse,
  ISymbolInfo,
  IWatchCandlesRequest,
  IWatchCandlesResponse,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
  IPlaceMarketOrderRequest,
  ExchangeCode,
} from "@opentrader/types";
import { pro } from "ccxt";
import type { Dictionary, Market, Exchange } from "ccxt";
import type { IExchange, IExchangeCredentials } from "../../types/index.js";
import { cache } from "../../cache.js";
import { fetcher } from "../../utils/next/fetcher.js";
import { normalize } from "./normalize.js";
import { exchangeCodeMapCCXT } from "./constants.js";

export class CCXTExchange implements IExchange {
  public exchangeCode: ExchangeCode;
  public ccxt: Exchange;

  constructor(exchangeCode: ExchangeCode, credentials?: IExchangeCredentials) {
    this.exchangeCode = exchangeCode;

    const ccxtCredentials = credentials
      ? {
          apiKey: credentials.apiKey,
          secret: credentials.secretKey,
          password: credentials.password,
        }
      : undefined;

    const ccxtClassName = exchangeCodeMapCCXT[exchangeCode];
    this.ccxt = new pro[ccxtClassName](ccxtCredentials);

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
    return cacheProvider.getMarkets(this.exchangeCode, this.ccxt);
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

  async placeMarketOrder(params: IPlaceMarketOrderRequest) {
    const args = normalize.placeMarketOrder.request(params);
    const data = await this.ccxt.createMarketOrder(...args);

    return normalize.placeMarketOrder.response(data);
  }

  async placeStopOrder(
    params: IPlaceStopOrderRequest,
  ): Promise<IPlaceStopOrderResponse> {
    if (params.type === "limit" && params.price === undefined) {
      throw new Error("Validation: `price` required for Limit order type");
    }

    const args = normalize.placeStopOrder.request(params);
    const data = await this.ccxt.createStopOrder(...args);

    return normalize.placeStopOrder.response(data);
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

    return normalize.getSymbol.response(data, this.exchangeCode); // @todo refactor
  }

  async getSymbols(
    type: "spot" | "future" | "option" | "swap" = "spot",
  ): Promise<ISymbolInfo[]> {
    const markets = await this.loadMarkets();

    const spotMarkets = Object.entries(markets)
      .filter(([_currency, market]) => market?.type === type)
      .reduce<Dictionary<Market>>((acc, [currency, market]) => {
        return {
          ...acc,
          [currency]: market,
        };
      }, {});

    return normalize.getSymbols.response(spotMarkets, this.exchangeCode);
  }

  async watchOrders(
    params: IWatchOrdersRequest = {},
  ): Promise<IWatchOrdersResponse> {
    const args = normalize.watchOrders.request(params);
    const data = await this.ccxt.watchOrders(...args);

    return normalize.watchOrders.response(data);
  }

  async watchCandles(
    params: IWatchCandlesRequest,
  ): Promise<IWatchCandlesResponse> {
    const args = normalize.watchCandles.request(params);
    const data = await this.ccxt.watchOHLCV(...args);

    return normalize.watchCandles.response(data);
  }
}
