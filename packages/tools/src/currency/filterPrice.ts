import type { ISymbolFilter } from "@opentrader/types";
import Big from "big.js";
import { countDecimalPlaces } from "./common/countDecimalPlaces";

/**
 * Filters order price (quote currency)
 *
 * @param number - Price
 * @param filter - Symbol filter
 */
export function filterPrice(
  number: string | number,
  filter: ISymbolFilter,
): string {
  const maxAllowedDecimals = filter.decimals.price;
  const priceDecimals = countDecimalPlaces(number, {
    ignoreTrailingZeros: true,
  });

  if (maxAllowedDecimals === undefined) {
    return new Big(number).toFixed(priceDecimals);
  }

  if (priceDecimals > maxAllowedDecimals) {
    return new Big(number).toFixed(maxAllowedDecimals, Big.roundDown);
  }

  return new Big(number).toFixed(priceDecimals);
}
