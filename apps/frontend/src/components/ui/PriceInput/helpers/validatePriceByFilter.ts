import Big from "big.js";
import { ISymbolFilter } from "@opentrader/types";

/**
 * Return error message or `null` if there are no validation errors.
 * @param numStr
 * @param filter
 */
export function validatePriceByFilter(
  numStr: string,
  filter: ISymbolFilter,
): string | null {
  // skip validation for empty string
  if (numStr.length === 0) {
    return null;
  }

  const bigNum = new Big(numStr);

  const isLowerThan = filter.price.minPrice
    ? bigNum.lt(filter.price.minPrice)
    : null;
  const isGreaterThan = filter.price.maxPrice
    ? bigNum.gte(filter.price.maxPrice)
    : null;

  if (isLowerThan) {
    return `Price cannot be lower than MIN: ${filter.price.minPrice}`;
  }

  if (isGreaterThan) {
    return `Price cannot be higher than MAX: ${filter.price.maxPrice}`;
  }

  return null;
}
