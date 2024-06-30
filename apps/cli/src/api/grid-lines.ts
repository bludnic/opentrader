import { calcGridLines } from "@opentrader/tools";
import type { CommandResult } from "../types.js";

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
