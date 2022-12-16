import big from 'big.js';

export function calcSellPriceByGridLevel(
  gridLevelPrice: number,
  gridStepSize: number,
): number {
  return big(gridLevelPrice).plus(gridStepSize).toNumber();
}
