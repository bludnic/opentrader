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
  IGetSymbolInfoRequest,
  ISymbolInfo,
} from '@bifrost/types';

export class TestingExchangeService implements IExchangeService {
  // Testing-specific properties
  private assetPrice: number;
  public setCurrentAssetPrice(price: number) {
    this.assetPrice = price;
  }

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
    const { symbol } = params;

    return {
      symbol,
      price: this.assetPrice,
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

  async getSymbols(params: IGetSymbolInfoRequest): Promise<ISymbolInfo[]> {
    return [];
  }

  tradingPairSymbol(params: ITradingPairSymbolRequest) {
    return `${params.baseCurrency}-${params.quoteCurrency}`;
  }
}
