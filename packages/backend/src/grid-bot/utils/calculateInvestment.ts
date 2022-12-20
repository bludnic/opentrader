import big from 'big.js';
import {
  DealStatusEnum,
  IDeal,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';

export type CalculateInvestmentResult = {
  baseCurrencyAmount: number;
  quoteCurrencyAmount: number;
};

/**
 * Calculate Investment in Base and Quote currencies
 * required to place Buy/Sell limit orders on the exchange.
 *
 * @param deals
 * @param quantityPerGrid
 */
export function calculateInvestment(
  deals: IDeal[],
  quantityPerGrid: number,
): CalculateInvestmentResult {
  let baseCurrencyAmount = deals.reduce((amount, deal) => {
    if (deal.status === DealStatusEnum.SellPlaced) {
      return big(amount).plus(quantityPerGrid).toNumber();
    }

    return amount;
  }, 0);

  let quoteCurrencyAmount = deals.reduce((amount, deal) => {
    if (deal.status === DealStatusEnum.BuyPlaced) {
      const quoteAmountPerGrid = big(quantityPerGrid).div(deal.buyOrder.price);

      return big(amount).plus(quoteAmountPerGrid).toNumber();
    }

    return amount;
  }, 0);

  return { baseCurrencyAmount, quoteCurrencyAmount };
}
