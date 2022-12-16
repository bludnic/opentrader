import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IOKXGetAccountBalanceInputParams } from 'src/core/exchanges/okx/types/client/account/balance/get-account-balance-input-params.interface';
import { IOKXGetAccountBalanceResponse } from 'src/core/exchanges/okx/types/client/account/balance/get-account-balance-response.interface';
import { OKXResponse } from 'src/core/exchanges/okx/types/client/common/OKXResponse';
import { IOKXGetMarketPriceInputParams } from 'src/core/exchanges/okx/types/client/public-data/get-market-price/get-market-price-input-params.interface';
import { IOKXGetMarketPriceResponse } from 'src/core/exchanges/okx/types/client/public-data/get-market-price/get-market-price-response.interface';
import { IOKXCancelLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-input-params.interface';
import { IOKXCancelLimitOrderRequestBody } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-request-body.interface';
import { IOKXCancelLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-response.interface';
import { IOKXGetLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/get-limit-order/get-limit-order-input-params.interface';
import { IOKXGetLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/get-limit-order/get-limit-order-response.interface';
import { IOKXPlaceLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-input-params.interface';
import { IOKXPlaceLimitOrderRequestBody } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-request-body.interface';
import { IOKXPlaceLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-response.interface';
import { okexAuthHeaders } from 'src/core/exchanges/okx/utils/okexAuthHeaders';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { DefaultExchangeContext } from 'src/core/exchanges/utils/default-exchange-context';
import { AxiosPromise } from 'axios';

@Injectable()
export class OKXClientService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject(DefaultExchangeContext) private ctx: IExchangeContext,
  ) {}

  /**
   * Retrieve a list of assets (with non-zero balance), remaining balance, and available amount in the account.
   */
  getAccountBalance(
    params: IOKXGetAccountBalanceInputParams,
  ): AxiosPromise<OKXResponse<IOKXGetAccountBalanceResponse>> {
    const { apiUrl } = this.ctx.exchangeConfig;

    const METHOD = 'GET';
    const REQUEST_PATH = '/api/v5/account/balance';

    const requestUrlParams = new URLSearchParams();
    if (params.ccy) requestUrlParams.set('limit', params.ccy);

    const requestPathWithParams = `${REQUEST_PATH}${
      requestUrlParams.toString() ? `?${requestUrlParams}` : ''
    }`;
    const fullRequestUrl = `${apiUrl}${requestPathWithParams}`;

    return this.httpService
      .request<OKXResponse<IOKXGetAccountBalanceResponse>>({
        method: METHOD,
        url: fullRequestUrl,
        headers: {
          ...okexAuthHeaders(this.ctx, METHOD, requestPathWithParams),
        },
      })
      .toPromise();
  }

  /**
   * Place a Limit Order.
   */
  placeLimitOrder(
    params: IOKXPlaceLimitOrderInputParams,
  ): AxiosPromise<OKXResponse<IOKXPlaceLimitOrderResponse>> {
    const { apiUrl } = this.ctx.exchangeConfig;

    const METHOD = 'POST';
    const REQUEST_PATH = '/api/v5/trade/order';
    const requestBody: IOKXPlaceLimitOrderRequestBody = {
      instId: params.instId,
      clOrdId: params.clOrdId,
      tdMode: 'cash',
      posSide: 'net',
      ordType: 'limit',
      side: params.side,
      sz: params.sz,
      px: params.px,
    };

    const fullRequestUrl = `${apiUrl}${REQUEST_PATH}`;

    return this.httpService
      .request<OKXResponse<IOKXPlaceLimitOrderResponse>>({
        method: METHOD,
        url: fullRequestUrl,
        data: requestBody,
        headers: {
          ...okexAuthHeaders(this.ctx, METHOD, REQUEST_PATH, requestBody),
        },
      })
      .toPromise();
  }

  /**
   * Cancel a Limit Order.
   */
  cancelLimitOrder(
    params: IOKXCancelLimitOrderInputParams,
  ): AxiosPromise<OKXResponse<IOKXCancelLimitOrderResponse>> {
    const { apiUrl } = this.ctx.exchangeConfig;

    const METHOD = 'POST';
    const REQUEST_PATH = '/api/v5/trade/cancel-order';
    const requestBody: IOKXCancelLimitOrderRequestBody = {
      instId: params.instId,
      clOrdId: params.clOrdId,
    };

    const fullRequestUrl = `${apiUrl}${REQUEST_PATH}`;

    return this.httpService
      .request<OKXResponse<IOKXCancelLimitOrderResponse>>({
        method: METHOD,
        url: fullRequestUrl,
        data: requestBody,
        headers: {
          ...okexAuthHeaders(this.ctx, METHOD, REQUEST_PATH, requestBody),
        },
      })
      .toPromise();
  }

  /**
   * Get Limit Order.
   */
  getLimitOrder(
    params: IOKXGetLimitOrderInputParams,
  ): AxiosPromise<OKXResponse<IOKXGetLimitOrderResponse>> {
    const { apiUrl } = this.ctx.exchangeConfig;

    const METHOD = 'GET';
    const REQUEST_PATH = '/api/v5/trade/order';

    const requestUrlParams = new URLSearchParams();
    requestUrlParams.set('instId', params.instId);
    requestUrlParams.set('clOrdId', params.clOrdId);

    const requestPathWithParams = `${REQUEST_PATH}${
      requestUrlParams.toString() ? `?${requestUrlParams}` : ''
    }`;
    const fullRequestUrl = `${apiUrl}${requestPathWithParams}`;

    return this.httpService
      .request<OKXResponse<IOKXGetLimitOrderResponse>>({
        method: METHOD,
        url: fullRequestUrl,
        headers: {
          ...okexAuthHeaders(this.ctx, METHOD, requestPathWithParams),
        },
      })
      .toPromise();
  }

  getMarketPrice(
    params: IOKXGetMarketPriceInputParams,
  ): AxiosPromise<OKXResponse<IOKXGetMarketPriceResponse>> {
    const { apiUrl } = this.ctx.exchangeConfig;

    const METHOD = 'GET';
    const REQUEST_PATH = '/api/v5/public/mark-price';

    const requestUrlParams = new URLSearchParams();
    requestUrlParams.set('instType', params.instType);
    requestUrlParams.set('instId', params.instId);

    const requestPathWithParams = `${REQUEST_PATH}${
      requestUrlParams.toString() ? `?${requestUrlParams}` : ''
    }`;
    const fullRequestUrl = `${apiUrl}${requestPathWithParams}`;

    return this.httpService
      .request<OKXResponse<IOKXGetMarketPriceResponse>>({
        method: METHOD,
        url: fullRequestUrl,
        headers: {
          ...okexAuthHeaders(this.ctx, METHOD, requestPathWithParams),
        },
      })
      .toPromise();
  }
}
