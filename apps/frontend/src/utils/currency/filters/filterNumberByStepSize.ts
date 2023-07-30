import Big from "big.js";
import { countDecimalPlaces } from 'src/utils/currency/numbers/countDecimalPlaces';
import { getExponentAbs } from 'src/utils/currency/numbers/getExponentAbs';

export function filterNumberByStepSize(
  number: string,
  lotSize: string
): string {
  const maxAllowedDecimals = getExponentAbs(lotSize);
  const priceDecimals = countDecimalPlaces(number);

  // console.log("lotSize/price", lotSize, number);
  // console.log("maxAllowedDecimals", maxAllowedDecimals);
  // console.log("priceDecimals", priceDecimals);

  if (priceDecimals > maxAllowedDecimals) {
    return new Big(number).toFixed(maxAllowedDecimals, Big.roundDown);
  }

  return number;
}
