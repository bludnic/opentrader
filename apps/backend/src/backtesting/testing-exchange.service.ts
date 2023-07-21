import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import {
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
} from '@bifrost/types';
import { ETH_USDT } from './history/ETH_USDT_90_DAYS_REAL_ACCOUNT';

export class TestingExchangeService implements IExchangeService {
  async accountAssets(): Promise<IAccountAsset[]> {
    return [];
  }

  async getLimitOrder(
    body: IGetLimitOrderRequest,
  ): Promise<IGetLimitOrderResponse> {
    return {
      exchangeOrderId: '',
      clientOrderId: '',
      price: 0,
      quantity: 1,
      side: 'buy',
      status: 'filled',
      createdAt: 0,
    };
  }

  async placeLimitOrder(
    body: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse> {
    return {
      orderId: '',
      clientOrderId: '',
    };
  }

  async cancelLimitOrder(
    body: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse> {
    return {
      orderId: '',
      clientOrderId: '',
    };
  }

  async getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse> {
    return {
      symbol: 'UNI-USDT',
      price: ETH_USDT[ETH_USDT.length - 1].close,
      timestamp: 0,
    };
  }

  async getCandlesticks(
    params: IGetCandlesticksRequest,
  ): Promise<ICandlestick[]> {
    return [];
  }

  async getTradingFeeRates(
    params: IGetTradingFeeRatesRequest,
  ): Promise<IGetTradingFeeRatesResponse> {
    return {
      makerFee: 0,
      takerFee: 0,
    };
  }

  tradingPairSymbol(params: ITradingPairSymbolRequest) {
    return `${params.baseCurrency}-${params.quoteCurrency}`;
  }
}
