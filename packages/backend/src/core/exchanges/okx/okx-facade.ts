import { IOKXGetAccountBalanceResponse } from 'src/core/exchanges/okx/types/client/account/balance/get-account-balance-response.interface';
import { IOKXGetAccountBalanceDetails } from 'src/core/exchanges/okx/types/client/account/balance/types/get-account-balance-details.interface';
import { IOKXGetTradingFeeRatesInputParams } from 'src/core/exchanges/okx/types/client/account/trading-fee/get-trading-fee-rates-input-params.interface';
import { IOKXGetTradeFeeRatesResponse } from 'src/core/exchanges/okx/types/client/account/trading-fee/get-trading-fee-rates-response.interface';
import { IOKXGetCandlesticksInputParams } from 'src/core/exchanges/okx/types/client/market-data/get-candlesticks/get-candlesticks-input-params.interface';
import { IOKXGetCandlesticksResponse } from 'src/core/exchanges/okx/types/client/market-data/get-candlesticks/get-candlesticks-response.interface';
import { IOKXGetMarketPriceInputParams } from 'src/core/exchanges/okx/types/client/public-data/get-market-price/get-market-price-input-params.interface';
import { IOKXGetMarketPriceResponse } from 'src/core/exchanges/okx/types/client/public-data/get-market-price/get-market-price-response.interface';
import { IOKXCancelLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-input-params.interface';
import { IOKXCancelLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/cancel-limit-order/cancel-limit-order-response.interface';
import { IOKXGetLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/get-limit-order/get-limit-order-input-params.interface';
import { IOKXGetLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/get-limit-order/get-limit-order-response.interface';
import { IOKXPlaceLimitOrderInputParams } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-input-params.interface';
import { IOKXPlaceLimitOrderResponse } from 'src/core/exchanges/okx/types/client/trade/place-limit-order/place-limit-order-response.interface';
import { IAccountAsset } from 'src/core/exchanges/types/exchange/account/account-asset/account-asset.interface';
import { IGetTradingFeeRatesRequest } from 'src/core/exchanges/types/exchange/account/trade-fee/get-trading-fee-rates-request.interface';
import { IGetTradingFeeRatesResponse } from 'src/core/exchanges/types/exchange/account/trade-fee/get-trading-fee-rates-response.interface';
import { IGetCandlesticksRequest } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/get-candlesticks-request.interface';
import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
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
      availableBalance: Number(data.availBal),
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
    if('exchangeOrderId' in data) {
      return {
        instId: data.symbol,
        ordId: data.exchangeOrderId,
      };
    }

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
    if ('exchangeOrderId' in data) {
      return {
        instId: data.symbol,
        ordId: data.exchangeOrderId,
      }
    }

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

  getCandlesticksInputParams(
    data: IGetCandlesticksRequest,
  ): IOKXGetCandlesticksInputParams {
    return {
      instId: `${data.symbol}-SWAP`,
      bar: data.bar,
      limit: String(data.limit),
    };
  },
  getCandlesticksOutput(data: IOKXGetCandlesticksResponse): ICandlestick[] {
    const candlesticks = data;

    return candlesticks.map((candlestick) => ({
      timestamp: Number(candlestick[0]),
      open: Number(candlestick[1]),
      high: Number(candlestick[2]),
      low: Number(candlestick[3]),
      close: Number(candlestick[4]),
    }));
  },

  getTradingFeeRatesInputParams(
    data: IGetTradingFeeRatesRequest,
  ): IOKXGetTradingFeeRatesInputParams {
    const { baseCurrency, quoteCurrency } = data;

    return {
      instId: `${baseCurrency}-${quoteCurrency}`,
      instType: 'SPOT',
    };
  },
  getTradingFeeRatesOutput(
    data: IOKXGetTradeFeeRatesResponse,
  ): IGetTradingFeeRatesResponse {
    const tradingFee = data[0];

    return {
      makerFee: Math.abs(Number(tradingFee.maker)), // converts negative number to positive
      takerFee: Math.abs(Number(tradingFee.taker)), // converts negative number to positive
    };
  },
};
