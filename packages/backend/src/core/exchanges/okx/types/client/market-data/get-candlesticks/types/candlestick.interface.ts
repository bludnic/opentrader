export type IOKXCandlestick = [
  /**
   * Data generation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
   */
  string,
  /**
   * Open price
   */
  string,
  /**
   * Highest price
   */
  string,
  /**
   * Lowest price
   */
  string,
  /**
   * Close price
   */
  string,
  /**
   * Trading volume, with a unit of `contract`.
   * If it is a derivatives contract, the value is the number of contracts.
   * If it is `SPOT/MARGIN`, the value is the amount of base currency.
   */
  string,
  /**
   * Trading volume, with a unit of `currency`.
   * If it is a `derivatives` contract, the value is the number of base currency.
   * If it is `SPOT/MARGIN`, the value is the number of quote currency.
   */
  string,
];
