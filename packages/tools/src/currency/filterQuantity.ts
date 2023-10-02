import { ISymbolFilter } from "@opentrader/types";
import Big from "big.js";
import { countDecimalPlaces } from "./common/countDecimalPlaces";
import { getExponentAbs } from "./common/getExponentAbs";

/**
 * Filters quantity of the base currency
 *
 * @param number
 * @param filter
 */
export function filterQuantity(
  number: string | number,
  filter: ISymbolFilter
): string {
  const maxAllowedDecimals = getExponentAbs(filter.lot.stepSize);
  const lotDecimals = countDecimalPlaces(number, {
    ignoreTrailingZeros: true,
  });

  if (lotDecimals > maxAllowedDecimals) {
    return new Big(number).toFixed(maxAllowedDecimals, Big.roundDown);
  }

  return new Big(number).toFixed(lotDecimals);
}
