import { DealStatusEnum, OrderStatusEnum } from '@bifrost/types';
import { GridBotE2EDeal } from 'src/e2e/grid-bot/deals/types';

function deal(
  id: string,
  buyPrice: number,
  sellPrice: number,
  dealStatus: DealStatusEnum,
): GridBotE2EDeal {
  const dealOrderStatusMap: Record<
    DealStatusEnum,
    { buy: OrderStatusEnum; sell: OrderStatusEnum }
  > = {
    [DealStatusEnum.Idle]: {
      buy: OrderStatusEnum.Idle,
      sell: OrderStatusEnum.Idle,
    },
    [DealStatusEnum.BuyPlaced]: {
      buy: OrderStatusEnum.Placed,
      sell: OrderStatusEnum.Idle,
    },
    [DealStatusEnum.BuyFilled]: {
      buy: OrderStatusEnum.Filled,
      sell: OrderStatusEnum.Idle,
    },
    [DealStatusEnum.SellPlaced]: {
      buy: OrderStatusEnum.Filled,
      sell: OrderStatusEnum.Placed,
    },
    [DealStatusEnum.SellFilled]: {
      buy: OrderStatusEnum.Filled,
      sell: OrderStatusEnum.Filled,
    },
  };

  return {
    id,
    status: dealStatus,
    buy: {
      price: buyPrice,
      status: dealOrderStatusMap[dealStatus].buy,
    },
    sell: {
      price: sellPrice,
      status: dealOrderStatusMap[dealStatus].sell,
    },
  };
}

function dealIdle(
  id: string,
  buyPrice: number,
  sellPrice: number,
): GridBotE2EDeal {
  return deal(id, buyPrice, sellPrice, DealStatusEnum.BuyPlaced);
}

export function dealBuyPlaced(
  id: string,
  buyPrice: number,
  sellPrice: number,
): GridBotE2EDeal {
  return deal(id, buyPrice, sellPrice, DealStatusEnum.BuyPlaced);
}

export function dealBuyFilled(
  id: string,
  buyPrice: number,
  sellPrice: number,
): GridBotE2EDeal {
  return deal(id, buyPrice, sellPrice, DealStatusEnum.BuyFilled);
}

export function dealSellPlaced(
  id: string,
  buyPrice: number,
  sellPrice: number,
): GridBotE2EDeal {
  return deal(id, buyPrice, sellPrice, DealStatusEnum.SellPlaced);
}

function dealSellFilled(
  id: string,
  buyPrice: number,
  sellPrice: number,
): GridBotE2EDeal {
  return deal(id, buyPrice, sellPrice, DealStatusEnum.SellFilled);
}


