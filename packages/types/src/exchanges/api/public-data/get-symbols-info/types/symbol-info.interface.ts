import { ExchangeCode } from "src/common";
import { ISymbolFilter } from "./symbol-filter.interface";

export interface ISymbolInfo {
  /**
   * Internal symbol ID.
   *
   * - `BINA:BTC-USDT` for Binance SPOT
   * - `OKX: ETH-USDT` for OKx Spot
   */
  symbolId: string;
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
