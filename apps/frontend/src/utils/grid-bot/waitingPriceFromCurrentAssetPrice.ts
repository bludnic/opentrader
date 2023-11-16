export function waitingPriceFromCurrentAssetPrice(
  prices: number[],
  currentAssetPrice: number,
) {
  if (prices.length === 0) {
    return -1;
  }

  if (prices.length === 1) {
    return prices[0];
  }

  const priceDistances = prices.map((price) =>
    Math.abs(price - currentAssetPrice),
  );
  const minDistance = Math.min(...priceDistances);
  const index = priceDistances.indexOf(minDistance);

  return prices[index];
}
