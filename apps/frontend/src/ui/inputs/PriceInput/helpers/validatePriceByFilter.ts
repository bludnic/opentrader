import Big from "big.js";
import type { ISymbolFilter } from "@opentrader/types";

/**
 * Return error message or `null` if there are no validation errors.
 * @param numStr - Price
 * @param filter - Symbol filter
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

  const isLowerThan = filter.limits.price?.min
    ? bigNum.lt(filter.limits.price?.min)
    : null;
  const isGreaterThan = filter.limits.price?.max
    ? bigNum.gte(filter.limits.price?.max)
    : null;

  if (isLowerThan) {
    return `Price cannot be lower than MIN: ${filter.limits.price?.min}`;
  }

  if (isGreaterThan) {
    return `Price cannot be higher than MAX: ${filter.limits.price?.max}`;
  }

  return null;
}
