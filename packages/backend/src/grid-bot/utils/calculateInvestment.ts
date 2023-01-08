import big from 'big.js';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';

export type CalculateInvestmentResult = {
  baseCurrencyAmount: number;
  quoteCurrencyAmount: number;
};

/**
 * Calculate Investment in Base and Quote currencies
 * required to place Buy/Sell limit orders on the exchange.
 *
 * @param deals
 */
export function calculateInvestment(deals: IDeal[]): CalculateInvestmentResult {
  let baseCurrencyAmount = deals.reduce((amount, deal) => {
    if (deal.status === DealStatusEnum.SellPlaced) {
      return big(amount).plus(deal.quantity).toNumber();
    }

    return amount;
  }, 0);

  let quoteCurrencyAmount = deals.reduce((amount, deal) => {
    if (deal.status === DealStatusEnum.BuyPlaced) {
      const quoteAmountPerGrid = big(deal.quantity).times(deal.buyOrder.price);

      return big(amount).plus(quoteAmountPerGrid).toNumber();
    }

    return amount;
  }, 0);

  return { baseCurrencyAmount, quoteCurrencyAmount };
}
