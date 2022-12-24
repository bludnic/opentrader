/**
 * Моки ботов для unit тестов.
 *
 * Стоит завести больше ботов с разными сценариями.
 */
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import {
  DealBuyFilled,
  DealBuyPlaced,
  DealSellFilled,
  DealSellPlaced,
  IDeal,
} from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { exchangeAccountMock } from 'src/e2e/grid-bot/exchange-account';
import { user } from 'src/e2e/grid-bot/user';

export const DOT_BUSD_SYMBOL = 'DOT-BUSD';

export const DOT_BUSD_BOT_WITH_NO_DEALS_MOCK: IGridBot = {
  id: 'DOTBUSDBOT1',
  name: '[DOT/BUSD] Testing Bot #1',
  baseCurrency: 'DOT',
  quoteCurrency: 'BUSD',
  enabled: false,
  createdAt: 1643502168575,
  gridLevels: 6,
  highPrice: 20,
  lowPrice: 10,
  quantityPerGrid: 20,
  deals: [],

  userId: user.uid,
  exchangeAccountId: exchangeAccountMock.id,
};

export const DOT_BUSD_CURRENT_ASSET_PRICE_MOCK = 14.5;

export const DOT_BUSD_DEALS_MOCK: IDeal[] = [
  {
    id: 'DOTBUSD1',
    buyOrder: {
      clientOrderId: 'DOTBUSD1B',
      price: 10,
      status: OrderStatusEnum.Placed,
      side: OrderSideEnum.Buy,
    },
    sellOrder: {
      clientOrderId: 'DOTBUSD1S',
      price: 12,
      status: OrderStatusEnum.Idle,
      side: OrderSideEnum.Sell,
    },
    status: DealStatusEnum.BuyPlaced,
  },
  {
    id: 'DOTBUSD2',
    buyOrder: {
      clientOrderId: 'DOTBUSD2B',
      price: 12,
      status: OrderStatusEnum.Placed,
      side: OrderSideEnum.Buy,
    },
    sellOrder: {
      clientOrderId: 'DOTBUSD2S',
      price: 14,
      status: OrderStatusEnum.Idle,
      side: OrderSideEnum.Sell,
    },
    status: DealStatusEnum.BuyPlaced,
  },
  {
    // current
    id: 'DOTBUSD3',
    buyOrder: {
      clientOrderId: 'DOTBUSD3B',
      price: 14,
      status: OrderStatusEnum.Filled,
      side: OrderSideEnum.Buy,
    },
    sellOrder: {
      clientOrderId: 'DOTBUSD3S',
      price: 16,
      status: OrderStatusEnum.Placed,
      side: OrderSideEnum.Sell,
    },
    status: DealStatusEnum.SellPlaced,
  },
  // sell orders
  {
    id: 'DOTBUSD4',
    buyOrder: {
      clientOrderId: 'DOTBUSD4B',
      price: 16,
      status: OrderStatusEnum.Filled,
      side: OrderSideEnum.Buy,
    },
    sellOrder: {
      clientOrderId: 'DOTBUSD4S',
      price: 18,
      status: OrderStatusEnum.Placed,
      side: OrderSideEnum.Sell,
    },
    status: DealStatusEnum.SellPlaced,
  },
  {
    id: 'DOTBUSD5',
    buyOrder: {
      clientOrderId: 'DOTBUSD5B',
      price: 18,
      status: OrderStatusEnum.Filled,
      side: OrderSideEnum.Buy,
    },
    sellOrder: {
      clientOrderId: 'DOTBUSD5S',
      price: 20,
      status: OrderStatusEnum.Placed,
      side: OrderSideEnum.Sell,
    },
    status: DealStatusEnum.SellPlaced,
  },
];

export const DOT_BUSD_BUY_FILLED_DEAL: DealBuyFilled = {
  id: 'DOTBUSD1',
  buyOrder: {
    clientOrderId: 'DOTBUSD1B',
    price: 10,
    status: OrderStatusEnum.Filled,
    side: OrderSideEnum.Buy,
  },
  sellOrder: {
    clientOrderId: 'DOTBUSD1S',
    price: 12,
    status: OrderStatusEnum.Idle,
    side: OrderSideEnum.Sell,
  },
  status: DealStatusEnum.BuyFilled,
};

export const DOT_BUSD_SELL_PLACED_DEAL: DealSellPlaced = {
  id: 'DOTBUSD1',
  buyOrder: {
    clientOrderId: 'DOTBUSD1B',
    price: 10,
    status: OrderStatusEnum.Filled,
    side: OrderSideEnum.Buy,
  },
  sellOrder: {
    clientOrderId: 'DOTBUSD1S',
    price: 12,
    status: OrderStatusEnum.Placed,
    side: OrderSideEnum.Sell,
  },
  status: DealStatusEnum.SellPlaced,
};

export const DOT_BUSD_SELL_FILLED_DEAL: DealSellFilled = {
  id: 'DOTBUSD5',
  buyOrder: {
    clientOrderId: 'DOTBUSD5B',
    price: 18,
    status: OrderStatusEnum.Filled,
    side: OrderSideEnum.Buy,
  },
  sellOrder: {
    clientOrderId: 'DOTBUSD5S',
    price: 20,
    status: OrderStatusEnum.Filled,
    side: OrderSideEnum.Sell,
  },
  status: DealStatusEnum.SellFilled,
};

export const DOT_BUSD_BUY_PLACED_DEAL: DealBuyPlaced = {
  id: 'DOTBUSD5',
  buyOrder: {
    clientOrderId: 'DOTBUSD5B',
    price: 18,
    status: OrderStatusEnum.Placed,
    side: OrderSideEnum.Buy,
  },
  sellOrder: {
    clientOrderId: 'DOTBUSD5S',
    price: 20,
    status: OrderStatusEnum.Idle,
    side: OrderSideEnum.Sell,
  },
  status: DealStatusEnum.BuyPlaced,
};

export const DOT_BUSD_LIMIT_ORDERS_MOCK: IPlaceLimitOrderRequest[] = [
  {
    clientOrderId: 'DOTBUSD1B',
    price: 10,
    quantity: 20,
    side: OrderSideEnum.Buy,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD2B',
    price: 12,
    quantity: 20,
    side: OrderSideEnum.Buy,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD3S',
    price: 16,
    quantity: 20,
    side: OrderSideEnum.Sell,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD4S',
    price: 18,
    quantity: 20,
    side: OrderSideEnum.Sell,
    symbol: DOT_BUSD_SYMBOL,
  },
  {
    clientOrderId: 'DOTBUSD5S',
    price: 20,
    quantity: 20,
    side: OrderSideEnum.Sell,
    symbol: DOT_BUSD_SYMBOL,
  },
];
