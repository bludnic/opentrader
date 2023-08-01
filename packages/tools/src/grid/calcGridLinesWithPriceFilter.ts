import Big from "big.js";
import { filterPrice } from "../currency";
import { calcGridLines } from "./calcGridLines";
import { IGridLine, ISymbolFilter } from "@bifrost/types";

export function calcGridLinesWithPriceFilter(
  highPrice: number,
  lowPrice: number,
  gridLevels: number,
  quantity: number,
  filter: ISymbolFilter
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
