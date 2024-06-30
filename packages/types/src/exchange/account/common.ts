export interface IAccountAsset {
  /**
   * e.g. USDT
   */
  currency: string;
  /**
   * Total balance
   */
  balance: number;
  /**
   * Available balance
   */
  availableBalance: number;
}
