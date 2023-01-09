/**
 * Converts `baseCurrency` and `quoteCurrency` to 3commas format.
 *
 * @param baseCurrency
 * @param quoteCurrency
 */
export function baseQuoteThreeCommas(
  baseCurrency: string,
  quoteCurrency: string,
): string {
  return `${quoteCurrency}_${baseCurrency}`;
}
