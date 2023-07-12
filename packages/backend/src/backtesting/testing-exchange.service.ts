import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface";
import { IAccountAsset } from "src/core/exchanges/types/exchange/account/account-asset/account-asset.interface";
import { IGetTradingFeeRatesRequest } from "src/core/exchanges/types/exchange/account/trade-fee/get-trading-fee-rates-request.interface";
import { IGetTradingFeeRatesResponse } from "src/core/exchanges/types/exchange/account/trade-fee/get-trading-fee-rates-response.interface";
import { ITradingPairSymbolRequest } from "src/core/exchanges/types/exchange/helpers/trading-pair-symbol/trading-pair-symbol-request.interface";
import { IGetCandlesticksRequest } from "src/core/exchanges/types/exchange/market-data/get-candlesticks/get-candlesticks-request.interface";
import { ICandlestick } from "src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface";
import { IGetMarketPriceRequest } from "src/core/exchanges/types/exchange/public-data/get-market-price/get-market-price-request.interface";
import { IGetMarketPriceResponse } from "src/core/exchanges/types/exchange/public-data/get-market-price/get-market-price-response.interface";
import { ICancelLimitOrderRequest } from "src/core/exchanges/types/exchange/trade/cancel-limit-order/cancel-limit-order-request.interface";
import { ICancelLimitOrderResponse } from "src/core/exchanges/types/exchange/trade/cancel-limit-order/cancel-limit-order-response.interface";
import { IGetLimitOrderRequest } from "src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-request.interface";
import { IGetLimitOrderResponse } from "src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-response.interface";
import { IPlaceLimitOrderRequest } from "src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface";
import { IPlaceLimitOrderResponse } from "src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-response.interface";
import { ETH_USDT } from './history/ETH_USDT_90_DAYS_REAL_ACCOUNT';

export class TestingExchangeService implements IExchangeService {
    async accountAssets(): Promise<IAccountAsset[]> {
        return []
    }

    async getLimitOrder(body: IGetLimitOrderRequest): Promise<IGetLimitOrderResponse> {
        return {
            exchangeOrderId: '',
            clientOrderId: '',
            price: 0,
            quantity: 1,
            side: 'buy',
            status: 'filled',
            createdAt: 0
        }
    }

    async placeLimitOrder(
      body: IPlaceLimitOrderRequest,
    ): Promise<IPlaceLimitOrderResponse> {
        return {
            orderId: '',
            clientOrderId: ''
        }
    }

    async cancelLimitOrder(
      body: ICancelLimitOrderRequest,
    ): Promise<ICancelLimitOrderResponse> {
        return {
            orderId: '',
            clientOrderId: ''
        }
    }

    async getMarketPrice(
      params: IGetMarketPriceRequest,
    ): Promise<IGetMarketPriceResponse> {
        return {
            symbol: 'UNI-USDT',
            price: ETH_USDT[ETH_USDT.length - 1].close,
            timestamp: 0
        }
    }

    async getCandlesticks(params: IGetCandlesticksRequest): Promise<ICandlestick[]> {
        return []
    }

    async getTradingFeeRates(
      params: IGetTradingFeeRatesRequest,
    ): Promise<IGetTradingFeeRatesResponse> {
        return {
            makerFee: 0,
            takerFee: 0
        }
    }

    tradingPairSymbol(params: ITradingPairSymbolRequest) {
        return `${params.baseCurrency}-${params.quoteCurrency}`
    };
}