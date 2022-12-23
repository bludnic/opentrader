import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { GridBotE2EDeal } from 'src/e2e/grid-bot/deals/types';

export function mapDealToE2EDeal(deal: IDeal): GridBotE2EDeal {
  return {
    id: deal.id,
    status: deal.status,
    buy: {
      price: deal.buyOrder.price,
      status: deal.buyOrder.status,
    },
    sell: {
      price: deal.sellOrder.price,
      status: deal.sellOrder.status,
    },
  };
}
