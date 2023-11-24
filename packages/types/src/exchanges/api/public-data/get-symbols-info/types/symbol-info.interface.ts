import type { ExchangeCode } from "src/common";
import type { ISymbolFilter } from "./symbol-filter.interface";

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
