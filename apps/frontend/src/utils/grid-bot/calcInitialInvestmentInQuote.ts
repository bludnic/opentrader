/**
 * Returns initialInvestment in Quote Currency
 */
import big from "big.js";
import {} from "@opentrader/types";

export function calcInitialInvestmentInQuote(
  initialInvestment: any // @todo use type from @opentrader/types
): number {
  throw new Error('missing type')
  const { baseCurrency, quoteCurrency } = initialInvestment;

  return big(baseCurrency.quantity)
    .times(baseCurrency.price)
    .plus(quoteCurrency.quantity)
    .toNumber();
}
