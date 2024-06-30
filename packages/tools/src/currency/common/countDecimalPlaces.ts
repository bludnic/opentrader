import Big from "big.js";

type Options = {
  ignoreTrailingZeros?: boolean;
};

/**
 *
 * @param number - e.g. "0.01000000" will return 2
 * @param options - Options
 */
export function countDecimalPlaces(
  number: string | number,
  options?: Options,
): number {
  // eslint-disable-next-line no-param-reassign -- its ok
  number = String(number);

  if (options?.ignoreTrailingZeros) {
    const bigNumber = new Big(number);

    // eslint-disable-next-line no-param-reassign -- its ok
    number = bigNumber.toString();
  }

  if (number.includes(".")) {
    return number.split(".")[1]!.length;
  }

  // String Does Not Contain Decimal
  return 0;
}
