import { Body } from "@nestjs/common"
import { useSmartTrade } from "src/core/bot-manager/effects"
import { Effect } from "src/core/bot-manager/effects/common/types/effects"
import { useExchange } from "src/core/bot-manager/effects/useExchange"
import { IBotControl } from "src/core/bot-manager/types/bot-control.interface"
import { OrderSideEnum } from "src/core/db/types/common/enums/order-side.enum"
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum"
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface"
import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface"

const grids = [
    { buy: 10, sell: 11, quantity: 1 },
    { buy: 11, sell: 12, quantity: 1 },
    { buy: 12, sell: 13, quantity: 1 },
    { buy: 13, sell: 14, quantity: 1 },
]

export function* useGridBot(bot: IBotControl) {
    const exchange: IExchangeService = yield useExchange();
    const currentAssetPrice = yield exchange.getMarketPrice({
        symbol: exchange.tradingPairSymbol({
            baseCurrency: bot.baseCurrency(),
            quoteCurrency: bot.quoteCurrency()
        })
    })

    console.log('[useGridBot] Current AVAX/USDT price is', currentAssetPrice)

    for (const [index, grid] of grids.entries()) {
        const smartTrade: ISmartTrade = yield useSmartTrade(`${index}`, {
            id: `AVAX_USDT_GRID_${index}`,
            botId: bot.id(),
            exchangeAccountId: bot.exchangeAccountId(),
            baseCurrency: bot.baseCurrency(),
            quoteCurrency: bot.quoteCurrency(),
            buy: {
                price: grid.buy,
            },
            sell: {
                price: grid.sell,
            },
            quantity: grid.quantity
        })

        const isFinished = smartTrade.sellOrder && smartTrade.sellOrder.status === 'filled';
        if (isFinished) {
            // yield smartTrade.replace()
            console.log('[useGridBot] SmartTrade finished ' + smartTrade.id)
        }
    }
}