import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { ITrade } from '../types/trade.interface';

export function convertSmartTradesToTrades(
  smartTrades: ISmartTrade[],
): ITrade[] {
  const trades: ITrade[] = [];

  for (const smartTrade of smartTrades) {
    const { buyOrder, sellOrder, quantity } = smartTrade;

    if (buyOrder.status === OrderStatusEnum.Filled) {
      trades.push({
        smartTradeId: smartTrade.id,
        price: buyOrder.price,
        quantity,
        side: OrderSideEnum.Buy,
        time: buyOrder.updatedAt,
      });
    }

    if (sellOrder && sellOrder.status === OrderStatusEnum.Filled) {
      trades.push({
        smartTradeId: smartTrade.id,
        price: sellOrder.price,
        quantity,
        side: OrderSideEnum.Sell,
        time: sellOrder.updatedAt,
      });
    }
  }

  return trades;
}
