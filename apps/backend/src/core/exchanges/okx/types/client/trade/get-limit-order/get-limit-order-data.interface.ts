import {
  OKXOrderSide,
  OKXOrderState,
} from 'src/core/exchanges/okx/types/client/trade/common';

export interface IOKXGetLimitOrderData {
  /**
   * Instrument ID
   */
  instId: string;
  /**
   * Exchange-supplied order ID.
   */
  ordId: string;
  /**
   * Client-supplied order ID.
   */
  clOrdId: string;
  /**
   * Trade price
   */
  px: string;
  /**
   * Fee.
   *
   * Negative number represents the user transaction fee charged by the platform.
   * Positive number represents rebate.
   */
  fee: string;
  /**
   * Trade quantity
   */
  sz: string;
  /**
   * Last filled quantity
   */
  fillSz: string;
  /**
   * Trade side (e.g. `buy`, `sell`)
   */
  side: OKXOrderSide;
  /**
   * Order status
   */
  state: OKXOrderState;
  /**
   * Update time, Unix timestamp format in milliseconds, e.g. 1597026383085
   */
  uTime: string;
  /**
   * Creation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  cTime: string;
}
