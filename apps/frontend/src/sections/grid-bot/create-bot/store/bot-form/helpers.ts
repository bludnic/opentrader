import Big from "big.js";
import { MIN_QUANTITY_PER_GRID_MULTIPLIER } from "./constants";

export function calcMinQuantityPerGrid(stepSize: string): string {
  return new Big(stepSize).times(MIN_QUANTITY_PER_GRID_MULTIPLIER).toString();
}
