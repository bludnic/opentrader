import { IDeal } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
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
