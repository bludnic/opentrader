/**
 * Returns initialInvestment in Quote Currency
 */
import big from "big.js";
import { InitialInvestmentDto } from "src/lib/bifrost/client";

export function calcInitialInvestmentInQuote(
  initialInvestment: InitialInvestmentDto
): number {
  const { baseCurrency, quoteCurrency } = initialInvestment;

  return big(baseCurrency.quantity)
    .times(baseCurrency.price)
    .plus(quoteCurrency.quantity)
    .toNumber();
}
