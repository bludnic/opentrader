import {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from '@bifrost/bot-processor';
import { exchanges } from '@bifrost/exchanges';
import { OrderNotFound } from 'ccxt';
import {
  toPrismaSmartTrade,
  toSmartTradeIteratorResult,
} from 'src/trpc/domains/grid-bot/processing/utils';
import { XPrismaClient } from 'src/trpc/prisma';
import { TGridBot } from 'src/trpc/prisma/types/grid-bot/grid-bot.schema';

export class GridBotStoreAdapter implements IStore {
  constructor(
    private prisma: XPrismaClient,
    private bot: TGridBot,
    private stopBotFn: (botId: number) => Promise<void>,
  ) {}

  stopBot(botId: number): Promise<void> {
    return this.stopBotFn(botId);
  }

  async getSmartTrade(ref: string, botId: number): Promise<SmartTrade | null> {
    try {
      const smartTrade = await this.prisma.smartTrade.findFirstOrThrow({
        where: {
          type: 'Trade',
          ref,
          bot: {
            id: botId,
          },
        },
        include: {
          orders: true,
        },
      });

      return toSmartTradeIteratorResult(smartTrade);
    } catch {
      return null; // throws error if not found
    }
  }

  async createSmartTrade(
    ref: string,
    payload: UseSmartTradePayload,
    botId: number,
  ) {
    console.log(`[GridBotStateManagement] createSmartTrade (key:${ref})`);

    const bot = await this.prisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot)
      throw new Error(
        `[GridBotStateManagement] getSmartTrade(): botId ${botId} not found`,
      );

    const exchangeSymbolId = `${bot.baseCurrency}/${bot.quoteCurrency}`;
    const data = toPrismaSmartTrade(payload, {
      ref,
      exchangeSymbolId,
      baseCurrency: bot.baseCurrency,
      quoteCurrency: bot.quoteCurrency,
      exchangeAccountId: bot.exchangeAccountId,
      ownerId: bot.ownerId,
      botId: bot.id,
    });

    // Clear old ref in case of `SmartTrade.replace()`
    // @todo db transaction
    await this.prisma.smartTrade.updateMany({
      where: {
        botId,
        ref,
      },
      data: {
        ref: null,
      },
    });
    const smartTrade = await this.prisma.smartTrade.create({
      data,
      include: {
        orders: true,
      },
    });

    console.log(
      `[GridBotControl] Smart Trade with (key:${ref}) was saved to DB`,
    );

    return toSmartTradeIteratorResult(smartTrade);
  }

  async cancelSmartTrade(ref: string, botId: number) {
    console.log(`[GridBotStateManagement] cancelSmartTrade (key:${ref})`);

    const bot = await this.prisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot)
      throw new Error(
        `[GridBotStateManagement] getSmartTrade(): botId ${botId} not found`,
      );

    const smartTrade = await this.prisma.smartTrade.findFirstOrThrow({
      where: {
        type: 'Trade',
        ref,
        bot: {
          id: botId,
        },
      },
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });
    const { exchangeAccount, orders } = smartTrade;

    for (const order of orders) {
      if (order.status === 'Idle') {
        await this.prisma.order.setStatus(order.id, 'Revoked');
      } else if (order.status === 'Placed') {
        const exchange = exchanges[exchangeAccount.exchangeCode](
          exchangeAccount.credentials,
        );

        if (!order.exchangeOrderId)
          throw new Error(
            `Order ${order.id} has missing \`exchangeOrderId\` field`,
          );

        try {
          await exchange.cancelLimitOrder({
            symbol: smartTrade.exchangeSymbolId,
            orderId: order.exchangeOrderId,
          });

          await this.prisma.order.setStatus(order.id, 'Canceled');
        } catch (err) {
          if (err instanceof OrderNotFound) {
            await this.prisma.order.setStatus(order.id, 'Deleted');
          } else {
            throw err;
          }
        }
      }
    }
  }
}
