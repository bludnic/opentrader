import { CreateSmartTradeDto } from 'src/core/db/firestore/repositories/smart-trade/dto/create-smart-trade/create-smart-trade.dto';
import { OrderSideEnum, OrderStatusEnum } from '@bifrost/types';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { uniqId } from 'src/core/db/utils/uniqId';
import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { USER_ID } from './mocks';

export class TestingDb {
  public smartTrades: ISmartTrade[] = [];

  getSmartTrade(smartTradeId: string): ISmartTrade | null {
    return (
      this.smartTrades.find((smartTrade) => smartTrade.id === smartTradeId) ||
      null
    );
  }

  createSmartTrade(key: string, dto: CreateSmartTradeDto): ISmartTrade {
    const docId = uniqId();
    const {
      comment,
      quantity,
      buy,
      sell,
      baseCurrency,
      quoteCurrency,
      exchangeAccountId,
      botId,
    } = dto;
    const createdAt = new Date().getTime();

    const smartTrade: ISmartTrade = {
      id: docId,
      baseCurrency,
      quoteCurrency,
      comment: comment || '',
      quantity: dto.quantity,
      buyOrder: {
        clientOrderId: buy.clientOrderId || '',
        exchangeOrderId: '',
        price: buy.price,
        quantity,
        status: buy.status || OrderStatusEnum.Idle,
        side: OrderSideEnum.Buy,
        fee: 0,
        createdAt,
        updatedAt: createdAt,
      },
      sellOrder: {
        clientOrderId: sell.clientOrderId || '',
        exchangeOrderId: '',
        price: sell.price,
        quantity,
        status: sell.status || OrderStatusEnum.Idle,
        side: OrderSideEnum.Sell,
        fee: 0,
        createdAt,
        updatedAt: createdAt,
      },
      createdAt,
      updatedAt: createdAt,
      botId: botId || null,
      exchangeAccountId,
      userId: USER_ID,
    };

    this.smartTrades.push(smartTrade);

    return smartTrade;
  }

  markIdleAsPlaced(smartTradeId: string) {
    const smartTrade = this.smartTrades.find(
      (smartTrade) => smartTrade.id === smartTradeId,
    );

    // Update orders statuses from Idle to Placed
    if (smartTrade.buyOrder.status === OrderStatusEnum.Idle) {
      smartTrade.buyOrder = {
        ...smartTrade.buyOrder,
        status: OrderStatusEnum.Placed,
      };
    } else if (
      smartTrade.sellOrder &&
      smartTrade.sellOrder.status === OrderStatusEnum.Idle &&
      smartTrade.buyOrder.status === OrderStatusEnum.Filled
    ) {
      smartTrade.sellOrder = {
        ...smartTrade.sellOrder,
        status: OrderStatusEnum.Placed,
      };
    }
  }

  // Update ST status to Filled based on current asset price
  processSmartTrade(smartTradeId: string, candle: ICandlestick) {
    const smartTrade = this.smartTrades.find(
      (smartTrade) => smartTrade.id === smartTradeId,
    );

    const updatedAt = candle.timestamp;

    if (smartTrade.buyOrder.status === OrderStatusEnum.Placed) {
      if (candle.close <= smartTrade.buyOrder.price) {
        smartTrade.buyOrder = {
          ...smartTrade.buyOrder,
          status: OrderStatusEnum.Filled,
          updatedAt,
        };
        console.log(
          `[TestingDb] ST# ${smartTradeId} buy order filled, updated at ${updatedAt}`,
        );
      }
    }

    if (
      smartTrade.sellOrder &&
      smartTrade.sellOrder.status === OrderStatusEnum.Placed
    ) {
      if (candle.close >= smartTrade.sellOrder.price) {
        smartTrade.sellOrder = {
          ...smartTrade.sellOrder,
          status: OrderStatusEnum.Filled,
          updatedAt,
        };

        console.log(
          `[TestingDb] ST# ${smartTradeId} sell order filled, updated at ${updatedAt}`,
        );
      }
    }
  }
}
