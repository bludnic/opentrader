import Big from "big.js";

type Options = {
  ignoreTrailingZeros?: boolean
}

/**
 *
 * @param numberStr e.g. "0.01000000" will return 2
 * @param options
 */
export function countDecimalPlaces(numberStr: string, options?: Options): number {
  if (options?.ignoreTrailingZeros) {
    const bigNumber = new Big(numberStr);

    numberStr = bigNumber.toString()
  }

  if (numberStr.includes(".")) {
    return numberStr.split(".")[1].length;
  }

  // String Does Not Contain Decimal
  return 0;
}
