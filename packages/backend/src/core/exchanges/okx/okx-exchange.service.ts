import { Injectable } from '@nestjs/common';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OKXFacade } from 'src/core/exchanges/okx/okx-facade';
import { IGetCandlesticksRequest } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/get-candlesticks-request.interface';
import { IGetMarketPriceRequest } from 'src/core/exchanges/types/exchange/public-data/get-market-price/get-market-price-request.interface';
import { ICancelLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/cancel-limit-order/cancel-limit-order-request.interface';
import { IGetLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-request.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
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
}
