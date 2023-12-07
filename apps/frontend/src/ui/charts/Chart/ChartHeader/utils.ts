import { fontSize } from "./constants";

/**
 * Calculates element with by price.
 */
export function calcWidthFromPrice(price: number | string): number {
  const priceString = typeof price === "number" ? price.toFixed(2) : price;

  return priceString.length * (fontSize * 0.85);
}

export function calculatePriceChange(open: number, close: number) {
  const priceChange = close - open;
  const percentChange = (priceChange / open) * 100;

  const percentageString = Math.abs(percentChange);

  if (priceChange < 0) {
    return `-${percentageString.toFixed(2)}%`;
  } else if (priceChange > 0) {
    return `+${percentChange.toFixed(2)}%`;
  }

  return `0%`; // no change in price
}
