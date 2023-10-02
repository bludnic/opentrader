import { ISymbolFilter } from "@opentrader/types";
import Big from "big.js";
import { countDecimalPlaces } from "./common/countDecimalPlaces";
import { getExponentAbs } from "./common/getExponentAbs";

/**
 * Filters order price (quote currency)
 *
 * @param number
 * @param filter
 */
export function filterPrice(
  number: string | number,
  filter: ISymbolFilter
): string {
  const maxAllowedDecimals = getExponentAbs(filter.price.tickSize);
  const priceDecimals = countDecimalPlaces(number, {
    ignoreTrailingZeros: true,
  });

  if (priceDecimals > maxAllowedDecimals) {
    return new Big(number).toFixed(maxAllowedDecimals, Big.roundDown);
  }

  return new Big(number).toFixed(priceDecimals);
}
