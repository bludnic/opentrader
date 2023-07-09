import { useSmartTrade } from "src/core/bot-manager/effects"
import { useExchange } from "src/core/bot-manager/effects/useExchange"
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface"
import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface"
import { IGetMarketPriceResponse } from "src/core/exchanges/types/exchange/public-data/get-market-price/get-market-price-response.interface"
import { GridBotControl } from "./grid-bot-control"
import { computeGridFromCurrentAssetPrice } from "./utils/grid/computeGridFromCurrentAssetPrice"

export function* useGridBot(bot: GridBotControl) {
    const exchange: IExchangeService = yield useExchange();
    const { price }: IGetMarketPriceResponse = yield exchange.getMarketPrice({
        symbol: exchange.tradingPairSymbol({
            baseCurrency: bot.baseCurrency(),
            quoteCurrency: bot.quoteCurrency()
        })
    })
    const gridLevels = computeGridFromCurrentAssetPrice(
        bot.entity.gridLines,
        price
    )

    for (const [index, grid] of gridLevels.entries()) {
        const smartTrade: ISmartTrade = yield useSmartTrade(`${index}`, {
            id: `${bot.entity.id}_${index}`,
            botId: bot.id(),
            exchangeAccountId: bot.exchangeAccountId(),
            baseCurrency: bot.baseCurrency(),
            quoteCurrency: bot.quoteCurrency(),
            buy: {
                price: grid.buy.price,
                status: grid.buy.status,
            },
            sell: {
                price: grid.sell.price,
                status: grid.sell.status,
            },
            quantity: grid.buy.quantity // or grid.sell.quantity
        })

        const isFinished = smartTrade.sellOrder && smartTrade.sellOrder.status === 'filled';
        if (isFinished) {
            // yield smartTrade.replace()
            console.log('[useGridBot] SmartTrade finished ' + smartTrade.id)
        }
    }
}