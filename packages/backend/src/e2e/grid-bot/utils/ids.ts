import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { gridBotSettings } from 'src/e2e/grid-bot/bot-settings';
import { generateOrderId } from 'src/grid-bot/utils/orders/generateOrderId';
import { generateDealId } from 'src/grid-bot/utils/deals/generateDealId';

export function dealId(gridNumber: number) {
    return generateDealId(
        gridBotSettings.baseCurrency,
        gridBotSettings.quoteCurrency,
        gridNumber,
    );
}

// Buy Order Id
export function buyId(gridNumber: number) {
    return generateOrderId(
        gridBotSettings.baseCurrency,
        gridBotSettings.quoteCurrency,
        gridNumber,
        OrderSideEnum.Buy,
    );
}

// Sell Order Id
export function sellId(gridNumber: number) {
    return generateOrderId(
        gridBotSettings.baseCurrency,
        gridBotSettings.quoteCurrency,
        gridNumber,
        OrderSideEnum.Sell,
    );
}
