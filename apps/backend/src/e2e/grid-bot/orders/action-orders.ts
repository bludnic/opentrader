import { GridBotE2EActionBuyOrder, GridBotE2EActionSellOrder } from './types';

export function buy(price: number): GridBotE2EActionBuyOrder {
  return {
    side: 'buy',
    price,
  };
}

export function sell(price: number): GridBotE2EActionSellOrder {
  return {
    side: 'sell',
    price,
  };
}
