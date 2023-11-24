import Big from "big.js";
import type { IGridLine, ISymbolFilter } from "@opentrader/types";
import { filterPrice } from "../currency";
import { calcGridLines } from "./calcGridLines";

export function calcGridLinesWithPriceFilter(
  highPrice: number,
  lowPrice: number,
  gridLevels: number,
  quantity: number,
  filter: ISymbolFilter,
): IGridLine[] {
  const gridLines = calcGridLines(highPrice, lowPrice, gridLevels, quantity);

  return gridLines.map((gridLine) => {
    const filteredPrice = filterPrice(gridLine.price, filter);

    return {
      ...gridLine,
      price: new Big(filteredPrice).toNumber(),
    };
  });
}
