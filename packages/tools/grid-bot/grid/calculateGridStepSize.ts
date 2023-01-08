import big from 'big.js';

export function calculateGridStepSize(
  highPrice: number,
  lowPrice: number,
  gridLevels: number,
): number {
  return big(highPrice)
    .minus(lowPrice)
    .div(gridLevels - 1)
    .toNumber();
}
