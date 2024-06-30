import type { ExchangeCode } from "../../common/enums.js";

export interface IGetSymbolInfoRequest {
  /**
   * e.g. BTC/USDT
   */
  currencyPair: string;
}

export interface ISymbolFilter {
  precision: PrecisionFilter;
  decimals: PrecisionDecimals;
  limits: LimitsFilter;
}

export interface PrecisionFilter {
  amount?: number;
  price?: number;
}

export interface PrecisionDecimals {
  amount?: number;
  price?: number;
}

export interface LimitsFilter {
  amount?: MinMaxFilter;
  cost?: MinMaxFilter;
  leverage?: MinMaxFilter;
  price?: MinMaxFilter;
}

export interface MinMaxFilter {
  min?: number;
  max?: number;
}

export interface ISymbolInfo {
  /**
   * e.g. OKX:BTC/USDT
   */
  symbolId: string;
  /**
   * e.g. BTC/USDT
   */
  currencyPair: string;
  exchangeCode: ExchangeCode;

  /**
   * Exchange supplied symbol ID
   *
   * Named as:
   * - `symbol` on Binance
   * - `instrumentId` on OKx
   * - `productId` on Coinbase
   * - May occur as `assetId` on other exchanges
   */
  exchangeSymbolId: string;

  baseCurrency: string;
  quoteCurrency: string;

  filters: ISymbolFilter;
}
