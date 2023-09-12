import { IExchange } from '@bifrost/exchanges';
import { Logger } from '@nestjs/common';
import { Prisma } from '@bifrost/prisma';
import { delay } from 'src/common/helpers/delay';
import { xprisma } from 'src/trpc/prisma';
import { SmartTradeWithOrders } from 'src/trpc/prisma/types/smart-trade/smart-trade-with-orders';

export class SmartTradeService {
  constructor(
    private smartTrade: SmartTradeWithOrders,
    private exchange: IExchange,
    private readonly logger: Logger,
  ) {}

  async placeOrders() {
    const pendingOrders = this.smartTrade.orders.filter(
      (order) => order.status === 'Idle',
    );

    for (const order of pendingOrders) {
      const placedOrder = await this.placeOrder(order);
      console.log('ST->placedOrder', placedOrder);

      // Update status to Placed
      // Save exchange orderId to DB
      await xprisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: 'Placed',
          exchangeOrderId: placedOrder.orderId,
          placedAt: new Date(), // maybe use Exchange time (if possible)
        },
      });

      await delay(1000);
    }
  }

  async placeOrder(order: Prisma.OrderGetPayload<{}>) {
    return this.exchange.placeLimitOrder({
      symbol: this.smartTrade.exchangeSymbolId,
      side: order.side === 'Buy' ? 'buy' : 'sell', // @todo map helper
      price: order.price,
      quantity: order.quantity,
    });
  }
}
