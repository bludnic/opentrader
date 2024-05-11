import Big from "big.js";
import type { ISymbolFilter } from "@opentrader/types";

/**
 * Return error message or `null` if there are no validation errors.
 * @param numStr - Quantity
 * @param filter - Symbol filter
 */
export function validateQuantityByFilter(
  numStr: string,
  filter: ISymbolFilter,
): string | null {
  // skip validation for empty string
  if (numStr.length === 0) {
    return null;
  }

  const bigNum = new Big(numStr);

  const isLowerThan = filter.limits.amount?.min
    ? bigNum.lt(filter.limits.amount?.min)
    : null;
  const isGreaterThan = filter.limits.amount?.max
    ? bigNum.gte(filter.limits.amount?.max)
    : null;

  if (isLowerThan) {
    return `Quantity cannot be lower than MIN: ${filter.limits.amount?.min}`;
  }

  if (isGreaterThan) {
    return `Quantity cannot be higher than MAX: ${filter.limits.amount?.max}`;
  }

  return null;
}
