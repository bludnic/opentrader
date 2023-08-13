export interface IGetSymbolInfoRequest {
  /**
   * Conventional symbol ID, e.g. `OKX:BTC-USDT`.
   *
   * Tip: Use `composeSymbolId()` from `tools` package to compose this value
   */
  symbolId: string;
}
