import Big from "big.js";

type Options = {
  ignoreTrailingZeros?: boolean;
};

/**
 *
 * @param numberStr e.g. "0.01000000" will return 2
 * @param options
 */
export function countDecimalPlaces(
  number: string | number,
  options?: Options
): number {
  number = String(number);

  if (options?.ignoreTrailingZeros) {
    const bigNumber = new Big(number);

    number = bigNumber.toString();
  }

  if (number.includes(".")) {
    return number.split(".")[1].length;
  }

  // String Does Not Contain Decimal
  return 0;
}
