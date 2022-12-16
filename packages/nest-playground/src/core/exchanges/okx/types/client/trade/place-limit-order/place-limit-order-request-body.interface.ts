import {
  OKXTradeMode,
  OKXOrderSide,
  OKXPositionSide,
  OKXOrderType,
  OKXQuantityType,
} from 'src/core/exchanges/okx/types/client/trade/common';

export interface IOKXPlaceLimitOrderRequestBody {
  /**
   * Instrument ID.
   *
   * e.g. ADA-USDT
   */
  instId: string;
  tdMode: OKXTradeMode;
  /**
   * Margin currency.
   *
   * Only applicable to cross MARGIN orders in Single-currency margin.
   */
  ccy?: string;
  /**
   * Client-supplied order ID.
   *
   * A combination of case-sensitive alphanumerics, all numbers, or all letters of up to 32 characters.
   */
  clOrdId?: string;
  /**
   * Order tag.
   *
   * A combination of case-sensitive alphanumerics, all numbers, or all letters of up to 16 characters.
   */
  tag?: string;
  side: OKXOrderSide;
  posSide: OKXPositionSide;
  ordType: OKXOrderType;
  /**
   * Quantity to buy or sell.
   */
  sz: string;
  /**
   * Order price.
   *
   * Only applicable to `limit`, `post_only`, `fok`, `ioc` order.
   */
  px?: string;
  /**
   * Whether to reduce position only or not, `true`/`false`, the default is `false`.
   * Only applicable to `MARGIN` orders, and `FUTURES/SWAP` orders in `net` mode
   * Only applicable to `Single-currency margin` and `Multi-currency margin`
   */
  reduceOnly?: boolean;
  tgtCcy?: OKXQuantityType;
}
