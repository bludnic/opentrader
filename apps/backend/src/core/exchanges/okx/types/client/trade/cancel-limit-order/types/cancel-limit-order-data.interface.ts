export interface IOKXCancelLimitOrderData {
  /**
   * Order ID
   */
  ordId: string;
  /**
   * Client-supplied order ID
   */
  clOrdId: string;
  /**
   * The code of the event execution result, 0 means success.
   */
  sCode: string;
  /**
   * Message shown when the event execution fails.
   */
  sMsg: string;
}
