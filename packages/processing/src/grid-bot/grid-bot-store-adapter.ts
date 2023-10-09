import {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from "@opentrader/bot-processor";
import { TGridBot, toSmartTradeEntity, xprisma } from "@opentrader/db";
import { SmartTradeRepository } from "#processing/repositories/smart-trade.repository";
import { toPrismaSmartTrade, toSmartTradeIteratorResult } from "./utils";

export class GridBotStoreAdapter implements IStore {
  constructor(
    private prisma: typeof xprisma,
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
          type: "Trade",
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

      return toSmartTradeIteratorResult(toSmartTradeEntity(smartTrade));
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

    return toSmartTradeIteratorResult(toSmartTradeEntity(smartTrade));
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
        type: "Trade",
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
      console.log("[GridBotStateManagement] SmartTrade not found");
      return false;
    }

    const smartTradeRepo = new SmartTradeRepository(
      smartTrade,
      smartTrade.exchangeAccount,
    );

    await smartTradeRepo.cancelOrders();

    return true;
  }
}
