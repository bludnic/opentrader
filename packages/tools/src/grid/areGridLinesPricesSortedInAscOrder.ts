/**
 * Return `true` if IGridLine[] prices are sorted ina ascendin order.
 */
import { IGridLine } from "@opentrader/types";
import Big from "big.js";

export function areGridLinesPricesSortedInAscOrder(gridLines: IGridLine[]) {
  return gridLines.slice(1).every((gridLine, i) => {
    const isGreaterThanOrEqual = new Big(gridLine.price).gte(
      gridLines[i].price
    );

    return isGreaterThanOrEqual;
  });
}
