export interface ISafetyOrder {
  /**
   * Price deviation from the Entry Order price in %
   */
  priceDeviation: number;
  /**
   * Quantity of the Safety Order in base currency
   */
  quantity: number;
}
