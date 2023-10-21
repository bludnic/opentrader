import Big from "big.js";
import { ISymbolFilter } from "@opentrader/types";

/**
 * Return error message or `null` if there are no validation errors.
 * @param numStr
 * @param filter
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

  const isLowerThan = filter.lot.minQuantity
    ? bigNum.lt(filter.lot.minQuantity)
    : null;
  const isGreaterThan = filter.lot.maxQuantity
    ? bigNum.gte(filter.lot.maxQuantity)
    : null;

  if (isLowerThan) {
    return `Quantity cannot be lower than MIN: ${filter.lot.minQuantity}`;
  }

  if (isGreaterThan) {
    return `Quantity cannot be higher than MAX: ${filter.lot.maxQuantity}`;
  }

  return null;
}
