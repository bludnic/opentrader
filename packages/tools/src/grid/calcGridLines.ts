import big from 'big.js';
import { calcGridStepSize } from './calcGridStepSize';
import { IGridLine } from '@bifrost/types';

// Note: Use this function only for tests purposes
// to avoid boilerplate
export function calcGridLines(
  highPrice: number,
  lowPrice: number,
  gridLevels: number,
  quantity: number,
): IGridLine[] {
  const gridStepSize: number = calcGridStepSize(
    highPrice,
    lowPrice,
    gridLevels,
  );

  return Array.from({ length: gridLevels }).map((_, i) => ({
    price: big(lowPrice).plus(big(gridStepSize).mul(i)).toNumber(),
    quantity,
  }));
}
