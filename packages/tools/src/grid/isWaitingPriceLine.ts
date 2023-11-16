/**
 * @param priceLine Element of `priceLines`
 * @param priceLines Array of prices
 * @param currentAssetPrice Current asset market price
 */
export function isWaitingPriceLine(
  priceLine: number,
  priceLines: number[],
  currentAssetPrice: number,
): boolean {
  // Sorting is not really required.
  // It just ensures that in case the `currentAssetPrice`
  // is at equal distance between two prices
  // the higher `priceLine` will be picked as a waiting price line
  priceLines = [...priceLines].sort((a, b) => b - a);

  if (priceLines.length === 0) {
    throw new Error("isCurrentPriceLine: empty array provided");
  }

  if (!priceLines.includes(priceLine)) {
    throw new Error(
      'isCurrentPriceLine: "priceLine" is not included in "priceLines"',
    );
  }

  if (priceLines.length === 1) {
    return true;
  }

  const priceDistances = priceLines.map((price) =>
    Math.abs(price - currentAssetPrice),
  );
  const minPriceDistance = Math.min(...priceDistances);
  const minGapIndex = priceDistances.findIndex(
    (priceDistance) => priceDistance === minPriceDistance,
  );

  const currentPriceLine = priceLines[minGapIndex];

  return priceLine === currentPriceLine;
}
