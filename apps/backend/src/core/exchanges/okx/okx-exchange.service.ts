import { Injectable } from '@nestjs/common';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OKXFacade } from 'src/core/exchanges/okx/okx-facade';
import {
  IGetCandlesticksRequest,
  IGetMarketPriceRequest,
  ICancelLimitOrderRequest,
  IGetLimitOrderRequest,
  IPlaceLimitOrderRequest,
} from '@bifrost/types';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';

@Injectable()
export class OkxExchangeService implements IExchangeService {
  constructor(private okxClient: OKXClientService) {}

  async accountAssets() {
    const { data } = await this.okxClient.getAccountBalance({});
    const normalizedAssets = OKXFacade.accountAssets(data.data);

    return normalizedAssets;
  }

  async placeLimitOrder(params: IPlaceLimitOrderRequest) {
    const inputParams = OKXFacade.placeLimitOrderInputParams(params);
    const { data } = await this.okxClient.placeLimitOrder(inputParams);
    const response = OKXFacade.placeLimitOrderOutput(data.data);

    return response;
  }

  async cancelLimitOrder(params: ICancelLimitOrderRequest) {
    const inputParams = OKXFacade.cancelLimitOrderInputParams(params);
    const { data } = await this.okxClient.cancelLimitOrder(inputParams);
    const response = OKXFacade.cancelLimitOrderOutput(data.data);

    return response;
  }

  async getLimitOrder(params: IGetLimitOrderRequest) {
    const inputParams = OKXFacade.getLimitOrderInputParams(params);
    const { data } = await this.okxClient.getLimitOrder(inputParams);
    const response = OKXFacade.getLimitOrderOutput(data.data);

    return response;
  }

  async getMarketPrice(params: IGetMarketPriceRequest) {
    const inputParams = OKXFacade.getMarketPriceInputParams(params);
    const { data } = await this.okxClient.getMarketPrice(inputParams);
    const response = OKXFacade.getMarketPriceOutput(data.data);

    return response;
  }

  async getCandlesticks(params: IGetCandlesticksRequest) {
    const inputParams = OKXFacade.getCandlesticksInputParams(params);
    const { data } = await this.okxClient.getCandlesticks(inputParams);
    const response = OKXFacade.getCandlesticksOutput(data.data);

    return response;
  }

  async getTradingFeeRates(params) {
    const inputParams = OKXFacade.getTradingFeeRatesInputParams(params);
    const { data } = await this.okxClient.getTradingFeeRates(inputParams);
    const response = OKXFacade.getTradingFeeRatesOutput(data.data);

    return response;
  }

  async getSymbols(params) {
    const inputParams = OKXFacade.getInstrumentsInputParams(params);
    const { data } = await this.okxClient.getInstruments(inputParams);
    const response = OKXFacade.getInstrumentsOutput(data.data);

    return response;
  }

  /**
   * OKx uses the `BTC-USDT` format for annotating trading pairs
   */
  tradingPairSymbol(params) {
    const { baseCurrency, quoteCurrency } = params;

    return `${baseCurrency}-${quoteCurrency}`;
  }
}
