import { IAccountAsset } from 'src/core/exchanges/okx/types/exchange/account/account-asset/account-asset.interface';
import { IGetMarketPriceRequest } from 'src/core/exchanges/okx/types/exchange/public-data/get-market-price/get-market-price-request.interface';
import { IGetMarketPriceResponse } from 'src/core/exchanges/okx/types/exchange/public-data/get-market-price/get-market-price-response.interface';
import { ICancelLimitOrderRequest } from 'src/core/exchanges/okx/types/exchange/trade/cancel-limit-order/cancel-limit-order-request.interface';
import { ICancelLimitOrderResponse } from 'src/core/exchanges/okx/types/exchange/trade/cancel-limit-order/cancel-limit-order-response.interface';
import { IGetLimitOrderRequest } from 'src/core/exchanges/okx/types/exchange/trade/get-limit-order/get-limit-order-request.interface';
import { IGetLimitOrderResponse } from 'src/core/exchanges/okx/types/exchange/trade/get-limit-order/get-limit-order-response.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/okx/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { IPlaceLimitOrderResponse } from 'src/core/exchanges/okx/types/exchange/trade/place-limit-order/place-limit-order-response.interface';

export interface IExchangeService {
  accountAssets(): Promise<IAccountAsset[]>;
  getLimitOrder(body: IGetLimitOrderRequest): Promise<IGetLimitOrderResponse>;
  placeLimitOrder(
    body: IPlaceLimitOrderRequest,
  ): Promise<IPlaceLimitOrderResponse>;
  cancelLimitOrder(
    body: ICancelLimitOrderRequest,
  ): Promise<ICancelLimitOrderResponse>;
  getMarketPrice(
    params: IGetMarketPriceRequest,
  ): Promise<IGetMarketPriceResponse>;
}
