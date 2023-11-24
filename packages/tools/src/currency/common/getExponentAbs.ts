import Big from "big.js";

/**
 * Extract the exponent of the number.
 *
 * @param numberLike - e.g. "0.01000000" will return 2
 */
export function getExponentAbs(numberLike: string): number {
  const number = new Big(numberLike);

  return Math.abs(number.e);
}
