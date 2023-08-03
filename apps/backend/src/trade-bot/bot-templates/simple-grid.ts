import { OrderSideEnum } from 'src/core/db/types/entities/trade-bot/orders/enums/order-side.enum';
import { IBotTemplate } from '../types/BotTemplate';
import { calcOkxSymbol } from '../utils/calcOkxSymbol';

const clientOrderId = 'ORD1';

export const simpleGrid: IBotTemplate = {
  async onStart({ logger, ordersService, bot }) {
    logger.debug(`[SimpleGridBot] onStart() called`);

    await ordersService.place(clientOrderId, {
      clientOrderId,
      symbol: calcOkxSymbol(bot.baseCurrency, bot.quoteCurrency),
      price: 10,
      quantity: 1,
      side: OrderSideEnum.Buy,
    });

    console.log(`[SimpleGridBot] Order with ID: ${clientOrderId} created`);
  },

  async onChange({ logger, bot, ordersService }) {
    logger.debug(`[SimpleGridBot] onChange() called`);

    const order = await ordersService.get(clientOrderId);

    console.log(
      `[SimpleGridBot] Order with ID: ${order.clientOrderId} was filled`,
      order,
    );
  },

  async onStop({ logger, ordersService, bot }) {
    logger.debug(`[SimpleGridBot] onStop() called`);

    await ordersService.cancel(clientOrderId);

    console.log(
      `[SimpleGridBot] Order with ID: ${clientOrderId} was cancelled`,
    );
  },
};
