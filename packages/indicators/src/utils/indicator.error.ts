export class IndicatorError extends Error {
  public indicator: string;

  /**
   * @param message - Error message
   * @param indicator - Indicator name, e.g. "RSI"
   */
  constructor(message: string, indicator: string) {
    super(message);
    this.name = "IndicatorError";
    this.indicator = indicator;
  }
}
