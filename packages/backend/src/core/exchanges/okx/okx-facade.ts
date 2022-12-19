import { IOKXGetAccountBalanceResponse } from 'src/core/exchanges/okx/types/client/account/balance/get-account-balance-response.interface';
import { IOKXGetAccountBalanceDetails } from 'src/core/exchanges/okx/types/client/account/balance/types/get-account-balance-details.interface';
import { IOKXGetMarketPriceInputParams } from 'src/core/exchanges/okx/types/client/public-data/get-market-price/get-market-price-input-params.interface';
import { IOKXGetMarketPriceResponse } from 'src/core/exchanges/okx/types/client/public-data/get-market-price/get-market-price-response.interface';
import { IOKXCancelLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-input-params.interface';
import { IOKXCancelLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-response.interface';
import { IOKXGetLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/get-limit-order/get-limit-order-input-params.interface';
import { IOKXGetLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/get-limit-order/get-limit-order-response.interface';
import { IOKXPlaceLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-input-params.interface';
import { IOKXPlaceLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-response.interface';
import { IAccountAsset } from 'src/core/exchanges/types/exchange/account/account-asset/account-asset.interface';
import { IGetMarketPriceRequest } from 'src/core/exchanges/types/exchange/public-data/get-market-price/get-market-price-request.interface';
import { IGetMarketPriceResponse } from 'src/core/exchanges/types/exchange/public-data/get-market-price/get-market-price-response.interface';
import { ICancelLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/cancel-limit-order/cancel-limit-order-request.interface';
import { ICancelLimitOrderResponse } from 'src/core/exchanges/types/exchange/trade/cancel-limit-order/cancel-limit-order-response.interface';
import { IGetLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-request.interface';
import { IGetLimitOrderResponse } from 'src/core/exchanges/types/exchange/trade/get-limit-order/get-limit-order-response.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { IPlaceLimitOrderResponse } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-response.interface';

export const OKXFacade = {
  accountAsset(data: IOKXGetAccountBalanceDetails): IAccountAsset {
    return {
      currency: data.ccy,
      balance: Number(data.eq),
    };
  },
  accountAssets(data: IOKXGetAccountBalanceResponse): IAccountAsset[] {
    const account1 = data[0];

    return account1.details.map((details) => this.accountAsset(details));
  },
  placeLimitOrderInputParams(
    data: IPlaceLimitOrderRequest,
  ): IOKXPlaceLimitOrderInputParams {
    return {
      instId: data.symbol,
      clOrdId: data.clientOrderId,
      side: data.side,
      sz: String(data.quantity),
      px: String(data.price),
    };
  },
  placeLimitOrderOutput(
    data: IOKXPlaceLimitOrderResponse,
  ): IPlaceLimitOrderResponse {
    const order = data[0];

    return {
      orderId: order.ordId,
      /**
       * Client-supplied order ID
       */
      clientOrderId: order.clOrdId,
    };
  },
  cancelLimitOrderInputParams(
    data: ICancelLimitOrderRequest,
  ): IOKXCancelLimitOrderInputParams {
    return {
      instId: data.symbol,
      clOrdId: data.clientOrderId,
    };
  },
  cancelLimitOrderOutput(
    data: IOKXCancelLimitOrderResponse,
  ): ICancelLimitOrderResponse {
    const order = data[0];

    return {
      orderId: order.ordId,
      clientOrderId: order.clOrdId,
    };
  },
  getLimitOrderInputParams(
    data: IGetLimitOrderRequest,
  ): IOKXGetLimitOrderInputParams {
    return {
      instId: data.symbol,
      clOrdId: data.clientOrderId,
    };
  },
  getLimitOrderOutput(data: IOKXGetLimitOrderResponse): IGetLimitOrderResponse {
    const order = data[0];

    return {
      exchangeOrderId: order.ordId,
      clientOrderId: order.clOrdId,
      side: order.side,
      quantity: Number(order.sz),
      filledQuantity: Number(order.fillSz),
      price: Number(order.px),
      createdAt: Number(order.cTime),
      status: order.state,
    };
  },
  getMarketPriceInputParams(
    data: IGetMarketPriceRequest,
  ): IOKXGetMarketPriceInputParams {
    return {
      instId: `${data.symbol}-SWAP`,
      instType: `SWAP`,
    };
  },
  getMarketPriceOutput(
    data: IOKXGetMarketPriceResponse,
  ): IGetMarketPriceResponse {
    const asset = data[0];

    return {
      symbol: asset.instId,
      price: Number(asset.markPx),
      timestamp: Number(asset.ts),
    };
  },
};
