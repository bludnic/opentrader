export interface IOKXPlaceLimitOrderData {
  /**
   * Order ID
   */
  ordId: string;
  /**
   * Client-supplied order ID
   */
  clOrdId: string;
  /**
   * Order tag
   */
  tag: string;
  /**
   * The code of the event execution result, 0 means success.
   */
  sCode: string;
  /**
   * Message shown when the event execution fails.
   */
  sMsg: string;
}
