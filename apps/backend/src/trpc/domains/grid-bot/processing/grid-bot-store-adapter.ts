import {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from '@bifrost/bot-processor';
import { SmartTradeService } from 'src/core/exchange-bus/smart-trade.service';
import {
  toPrismaSmartTrade,
  toSmartTradeIteratorResult,
} from 'src/trpc/domains/grid-bot/processing/utils';
import { XPrismaClient } from 'src/trpc/prisma';
import { toSmartTrade } from 'src/trpc/prisma/models/smart-trade-entity';
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
          exchangeAccount: true,
        },
      });

      return toSmartTradeIteratorResult(toSmartTrade(smartTrade));
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
        exchangeAccount: true,
      },
    });

    console.log(
      `[GridBotControl] Smart Trade with (key:${ref}) was saved to DB`,
    );

    return toSmartTradeIteratorResult(toSmartTrade(smartTrade));
  }

  async cancelSmartTrade(ref: string, botId: number) {
    console.log(`[GridBotStateManagement] cancelSmartTrade (ref:${ref})`);

    const bot = await this.prisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot)
      throw new Error(
        `[GridBotStateManagement] getSmartTrade(): botId ${botId} not found`,
      );

    const smartTrade = await this.prisma.smartTrade.findFirst({
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
    if (!smartTrade) {
      console.log('[GridBotStateManagement] SmartTrade not found');
      return false;
    }

    const smartTradeService = new SmartTradeService(
      smartTrade,
      smartTrade.exchangeAccount,
    );

    await smartTradeService.cancelOrders();

    return true;
  }
}
