import { SmartTrade, SmartTradeTypeEnum } from "@bifrost/bot-processor";
import { OrderStatusEnum } from "@bifrost/types";

export function fulfilledTable(smartTrades: SmartTrade[]) {
  const rows = smartTrades.flatMap((smartTrade, i) => {

    if (smartTrade.type !== SmartTradeTypeEnum.BuySell) {
      console.log(`fulfilledTable: smartTrade ${smartTrade.type} type is not supported`)
      return []
    }

    const { buy, sell } = smartTrade

    const isBuy = buy.status === OrderStatusEnum.Placed && sell.status === OrderStatusEnum.Idle
    const isSell = buy.status === OrderStatusEnum.Filled && sell.status === OrderStatusEnum.Placed

    const isBuyFilled = buy.status === OrderStatusEnum.Filled && sell.status === OrderStatusEnum.Idle
    const isSellFilled = buy.status === OrderStatusEnum.Filled && sell.status === OrderStatusEnum.Filled

    const prevSmartTrade = smartTrades[i-1]
    const isCurrent = isSell &&
      prevSmartTrade?.sell?.status === OrderStatusEnum.Idle ||
      isSellFilled &&
      prevSmartTrade?.sell?.status === OrderStatusEnum.Idle

    const side = isBuy || isBuyFilled
      ? 'buy'
      : isSell || isSellFilled
        ? 'sell'
        : 'unknown'

    const price = side === 'sell'
      ? smartTrade.sell.price
      : side === 'buy'
        ? smartTrade.buy.price
        : 'unknown'

    const gridLine = {
      stIndex: i,
      stId: smartTrade.id,
      side,
      price,
      buy: smartTrade.buy.price,
      sell: smartTrade.sell.price,
      filled: isBuyFilled ? 'buy filled' : isSellFilled ? 'sell filled' : ''
    }

    if (isCurrent) {
      const currentLine = {
        stIndex: '-',
        stId: '-',
        side: 'Curr',
        price: smartTrade.buy.price,
        buy: '-',
        sell: '-',
        filled: ''
      }

      return [currentLine, gridLine]
    }

    return [gridLine]
  })

  return rows.reverse()
}
