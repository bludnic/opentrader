import { exchanges, IExchange } from '@bifrost/exchanges';
import { Prisma } from '@bifrost/prisma';
import { OrderNotFound } from 'ccxt';
import { xprisma } from 'src/trpc/prisma';
import { ExchangeAccountWithCredentials } from 'src/trpc/prisma/types/exchange-account/exchange-account-with-credentials';
import { SmartTradeWithOrders } from 'src/trpc/prisma/types/smart-trade/smart-trade-with-orders';

export class SmartTradeService {
  private exchange: IExchange;

  constructor(
    private smartTrade: SmartTradeWithOrders,
    private exchangeAccount: ExchangeAccountWithCredentials,
  ) {
    this.exchange = exchanges[exchangeAccount.exchangeCode](
      exchangeAccount.credentials,
    );
  }

  async placeOrders() {
    const buyOrder = this.smartTrade.orders.find(
      (order) => order.side === 'Buy',
    );
    if (!buyOrder) {
      throw new Error('[SmartTradeService] SmartTrade missing Buy order');
    }

    const sellOrder = this.smartTrade.orders.find(
      (order) => order.side === 'Sell',
    );
    if (!sellOrder) {
      throw new Error('[SmartTradeService] SmartTrade missing Sell order');
    }

    const orderPendingPlacement =
      buyOrder.status === 'Idle'
        ? buyOrder
        : buyOrder.status === 'Filled' && sellOrder.status === 'Idle'
        ? sellOrder
        : null;

    if (orderPendingPlacement) {
      const placedOrder = await this.placeOrder(orderPendingPlacement);
      console.log('ST->placedOrder', placedOrder);

      // Update status to Placed
      // Save exchange orderId to DB
      await xprisma.order.update({
        where: {
          id: orderPendingPlacement.id,
        },
        data: {
          status: 'Placed',
          exchangeOrderId: placedOrder.orderId,
          placedAt: new Date(), // maybe use Exchange time (if possible)
        },
      });
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

  async cancelOrder(order: Prisma.OrderGetPayload<{}>) {
    if (!order.exchangeOrderId)
      throw new Error(
        `Order ${order.id} has missing \`exchangeOrderId\` field`,
      );

    await this.exchange.cancelLimitOrder({
      orderId: order.exchangeOrderId,
      symbol: this.smartTrade.exchangeSymbolId,
    });
    await xprisma.order.updateStatus('Canceled', order.id);
  }

  async cancelOrders() {
    for (const order of this.smartTrade.orders) {
      if (order.status === 'Idle') {
        await xprisma.order.updateStatus('Revoked', order.id);
      } else if (order.status === 'Placed') {
        try {
          await this.cancelOrder(order);
        } catch (err) {
          if (err instanceof OrderNotFound) {
            await xprisma.order.updateStatus('Deleted', order.id);
          } else {
            throw err;
          }
        }
      }
    }
  }
}
