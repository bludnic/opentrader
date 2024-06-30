import type { ISymbolFilter } from "@opentrader/types";
import Big from "big.js";
import { countDecimalPlaces } from "./common/countDecimalPlaces.js";

/**
 * Filters quantity of the base currency
 *
 * @param number - Quantity
 * @param filter - Symbol filter
 */
export function filterQuantity(
  number: string | number,
  filter: ISymbolFilter,
): string {
  const maxAllowedDecimals = filter.decimals.amount;
  const lotDecimals = countDecimalPlaces(number, {
    ignoreTrailingZeros: true,
  });

  if (maxAllowedDecimals === undefined) {
    return new Big(number).toFixed(lotDecimals);
  }

  if (lotDecimals > maxAllowedDecimals) {
    return new Big(number).toFixed(maxAllowedDecimals, Big.roundDown);
  }

  return new Big(number).toFixed(lotDecimals);
}
