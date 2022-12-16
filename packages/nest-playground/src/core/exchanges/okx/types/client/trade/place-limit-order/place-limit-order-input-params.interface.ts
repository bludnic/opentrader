import { OKXOrderSide } from 'src/core/exchanges/okx/types/client/trade/common';

export interface IOKXPlaceLimitOrderInputParams {
  /**
   * Instrument ID.
   *
   * e.g. ADA-USDT
   */
  instId: string;
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
}
