import big from "big.js";
import type { IGridLine } from "@opentrader/types";
import { calcGridStepSize } from "./calcGridStepSize";

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
