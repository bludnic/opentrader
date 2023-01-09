import big from 'big.js';

/**
 * e.g.
 * price: 200
 * plusPercent: 10
 * result: 220
 *
 * @param price
 * @param percent
 */
export function multiplyPriceByPercent(price: number, percent: number): number {
  const plusPrice = big(price)
    .times(percent / 100)
    .toNumber();

  return big(price).plus(plusPrice).toNumber();
}
