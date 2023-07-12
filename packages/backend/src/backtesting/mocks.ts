import { calcGridLines } from "@bifrost/tools"
import { IGridBot } from "src/core/db/types/entities/grid-bots/grid-bot.interface"

export const USER_ID = 'd3RcKHXukfOYq3Z27MNj2ZnbLQd2'
export const BOT_ID = 'UNI_USDT_BACKTESTING_BOT'
export const EXCHANGE_ACCOUNT_ID = 'okx_demo'
export const BASE_CURRENCY = 'UNI'
export const QUOTE_CURRENCY = 'USDT'

export const GRID_BOT: IGridBot = {
    id: BOT_ID,
    name: 'UNI/USDT Backtesting Bot',
    baseCurrency: BASE_CURRENCY,
    quoteCurrency: QUOTE_CURRENCY,
    gridLines: calcGridLines(1710, 1080, 64, 1),
    enabled: true,
    createdAt: 0,
    smartTrades: [],
  
    initialInvestment: {
        baseCurrency: {
            quantity: 0,
            price: 0
        },
        quoteCurrency: {
            quantity: 0,
        }
    },
  
    userId: USER_ID,
    exchangeAccountId: EXCHANGE_ACCOUNT_ID,
}