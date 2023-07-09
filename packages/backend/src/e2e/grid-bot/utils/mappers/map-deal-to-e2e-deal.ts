import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { GridBotE2EDeal } from 'src/e2e/grid-bot/deals/types';

// @todo rename to `mapSmartTradeToE2EDeal` and refactor the logic
export function mapDealToE2EDeal(smartTrade: ISmartTrade): GridBotE2EDeal {
  const dealStatus = smartTrade.buyOrder.status === OrderStatusEnum.Idle
    ? DealStatusEnum.Idle
    : smartTrade.buyOrder.status === OrderStatusEnum.Placed
      ? DealStatusEnum.BuyPlaced
      : smartTrade.buyOrder.status === OrderStatusEnum.Filled
        ? DealStatusEnum.BuyFilled
        : smartTrade.sellOrder.status === OrderStatusEnum.Idle ||
          smartTrade.sellOrder.status === OrderStatusEnum.Placed
          ? DealStatusEnum.SellPlaced
          : DealStatusEnum.SellPlaced

  return {
    id: smartTrade.id,
    status: dealStatus,
    buy: {
      price: smartTrade.buyOrder.price,
      status: smartTrade.buyOrder.status,
    },
    sell: {
      price: smartTrade.sellOrder.price,
      status: smartTrade.sellOrder.status,
    },
  };
}
