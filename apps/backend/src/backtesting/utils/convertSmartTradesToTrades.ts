import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { IBacktestingTrade } from '../dto/types/trade/trade.interface';

export function convertSmartTradesToTrades(
  smartTrades: ISmartTrade[],
): IBacktestingTrade[] {
  const trades: IBacktestingTrade[] = [];

  for (const smartTrade of smartTrades) {
    const { buyOrder, sellOrder, quantity } = smartTrade;

    if (buyOrder.status === OrderStatusEnum.Filled) {
      trades.push({
        smartTrade,
        price: buyOrder.price,
        quantity,
        side: OrderSideEnum.Buy,
        time: buyOrder.updatedAt,
      });
    }

    if (sellOrder && sellOrder.status === OrderStatusEnum.Filled) {
      trades.push({
        smartTrade,
        price: sellOrder.price,
        quantity,
        side: OrderSideEnum.Sell,
        time: sellOrder.updatedAt,
      });
    }
  }

  return trades.sort((left, right) => left.time - right.time);
}
