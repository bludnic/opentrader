import { OrderSideEnum } from '@bifrost/types';
import { gridBotSettings } from 'src/e2e/grid-bot/bot-settings';
import { generateDealId } from 'src/grid-bot/utils/deals/generateDealId';
import { generateUniqClientOrderId } from 'src/grid-bot/utils/orders/generateUniqClientOrderId';

export function dealId(gridNumber: number) {
  return generateDealId(
    gridBotSettings.baseCurrency,
    gridBotSettings.quoteCurrency,
    gridNumber,
  );
}

// Buy Order Id
export function buyId(gridNumber: number) {
  return generateUniqClientOrderId(
    gridBotSettings.baseCurrency,
    gridBotSettings.quoteCurrency,
    gridNumber,
    OrderSideEnum.Buy,
  );
}

// Sell Order Id
export function sellId(gridNumber: number) {
  return generateUniqClientOrderId(
    gridBotSettings.baseCurrency,
    gridBotSettings.quoteCurrency,
    gridNumber,
    OrderSideEnum.Sell,
  );
}
