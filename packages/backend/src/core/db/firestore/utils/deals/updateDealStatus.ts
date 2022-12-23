/**
 * Update Deal status and return new Deal.
 *
 * @param deal
 * @param toStatus
 */
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import {
  DealBuyFilled,
  DealBuyPlaced,
  DealIdle, DealSellFilled,
  DealSellPlaced,
  IDeal
} from 'src/core/db/types/entities/grid-bots/deals/types';

export function updateDealStatus(deal: IDeal, toStatus: DealStatusEnum) {
  if (toStatus === DealStatusEnum.Idle) {
    const newDeal: DealIdle = {
      ...deal,
      buyOrder: {
        ...deal.buyOrder,
        status: OrderStatusEnum.Idle,
      },
      sellOrder: {
        ...deal.sellOrder,
        status: OrderStatusEnum.Idle,
      },
      status: DealStatusEnum.Idle,
    };

    return newDeal;
  } else if (toStatus === DealStatusEnum.BuyPlaced) {
    const newDeal: DealBuyPlaced = {
      ...deal,
      buyOrder: {
        ...deal.buyOrder,
        status: OrderStatusEnum.Placed,
      },
      sellOrder: {
        ...deal.sellOrder,
        status: OrderStatusEnum.Idle,
      },
      status: DealStatusEnum.BuyPlaced,
    };

    return newDeal;
  } else if (toStatus === DealStatusEnum.BuyFilled) {
    const newDeal: DealBuyFilled = {
      ...deal,
      buyOrder: {
        ...deal.buyOrder,
        status: OrderStatusEnum.Filled,
      },
      sellOrder: {
        ...deal.sellOrder,
        status: OrderStatusEnum.Idle,
      },
      status: DealStatusEnum.BuyFilled,
    };

    return newDeal;
  } else if (toStatus === DealStatusEnum.SellPlaced) {
    const newDeal: DealSellPlaced = {
      ...deal,
      buyOrder: {
        ...deal.buyOrder,
        status: OrderStatusEnum.Filled,
      },
      sellOrder: {
        ...deal.sellOrder,
        status: OrderStatusEnum.Placed,
      },
      status: DealStatusEnum.SellPlaced,
    };

    return newDeal;
  } else if (toStatus === DealStatusEnum.SellFilled) {
    const newDeal: DealSellFilled = {
      ...deal,
      buyOrder: {
        ...deal.buyOrder,
        status: OrderStatusEnum.Filled,
      },
      sellOrder: {
        ...deal.sellOrder,
        status: OrderStatusEnum.Filled,
      },
      status: DealStatusEnum.SellFilled,
    };

    return newDeal;
  }
}
