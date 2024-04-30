import { calcGridLines } from "@opentrader/tools";
import { logger } from "@opentrader/logger";
import { IGridLine } from "@opentrader/types";
import { CommandResult } from "../types";

export function buildGridLines(
  maxPrice: number,
  minPrice: number,
  options: { lines: number; quantity: number },
): CommandResult {
  const gridLines = calcGridLines(
    maxPrice,
    minPrice,
    options.lines,
    options.quantity,
  );

  console.table(gridLines);

  return {
    result: undefined,
  };
}
