import { Logger } from '@nestjs/common';
import { IPlaceLimitOrderRequest } from '@bifrost/types';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { OrderStatusEnum } from 'src/core/db/types/entities/trade-bot/orders/enums/order-status.enum';
import { IOrder } from 'src/core/db/types/entities/trade-bot/orders/order.interface';
import { OrderStatus } from 'src/core/db/types/entities/trade-bot/orders/types/order-status.type';
import { ITradeBot } from 'src/core/db/types/entities/trade-bot/trade-bot.interface';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { calcOkxSymbol } from './utils/calcOkxSymbol';
import { fromExchangeOrderToTradeOrder } from './utils/fromExchangeOrderToTradeOrder';

export class TradeBotOrdersService {
  constructor(
    private bot: ITradeBot,
    private exchange: IExchangeService,
    private firestore: FirestoreService,
    private readonly logger: Logger,
  ) {}

  async getAll() {
    return this.firestore.tradeBot.getOrders(this.bot.id);
  }

  async get(orderId: string) {
    return this.firestore.tradeBot.getOrder(orderId, this.bot.id);
  }

  async place(orderId: string, orderData: IPlaceLimitOrderRequest) {
    const limitOrder = await this.exchange.placeLimitOrder(orderData);
    const order: IOrder = fromExchangeOrderToTradeOrder(orderData, limitOrder);

    return await this.firestore.tradeBot.createOrder(
      orderId,
      order,
      this.bot.id,
    );
  }

  async cancel(orderId: string) {
    // @todo the symbol strucuture may vary across exchanges
    // need a helper function for every exchange
    const symbol = calcOkxSymbol(this.bot.baseCurrency, this.bot.quoteCurrency);

    const order = await this.exchange.cancelLimitOrder({
      clientOrderId: orderId,
      symbol,
    });

    await this.firestore.tradeBot.updateOrder(
      order.clientOrderId,
      {
        status: OrderStatusEnum.Cancelled,
      },
      this.bot.id,
    );
  }

  async updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
    const order = await this.firestore.tradeBot.getOrder(orderId, this.bot.id);

    return this.firestore.tradeBot.updateOrder(
      orderId,
      {
        status: orderStatus,
      },
      this.bot.id,
    );
  }

  async maskAsFilled(orderId: string) {
    return this.updateOrderStatus(orderId, OrderStatusEnum.Filled);
  }

  async markAsCompleted(orderId: string) {
    return this.updateOrderStatus(orderId, OrderStatusEnum.Completed);
  }
}
