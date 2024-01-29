import type {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from "@opentrader/bot-processor";
import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import { SmartTradeProcessor } from "#processing/smart-trade";
import { toPrismaSmartTrade, toSmartTradeIteratorResult } from "./utils";

export class BotStoreAdapter implements IStore {
  constructor(private stopBotFn: (botId: number) => Promise<void>) {}

  stopBot(botId: number): Promise<void> {
    return this.stopBotFn(botId);
  }

  async getSmartTrade(ref: string, botId: number): Promise<SmartTrade | null> {
    try {
      const smartTrade = await xprisma.smartTrade.findFirstOrThrow({
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
    console.log(`[BotStoreAdapter] createSmartTrade (key:${ref})`);

    const bot = await xprisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot) {
      throw new Error(
        `[BotStoreAdapter] getSmartTrade(): botId ${botId} not found`,
      );
    }

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
    await xprisma.smartTrade.updateMany({
      where: {
        botId,
        ref,
      },
      data: {
        ref: null,
      },
    });
    const smartTrade = await xprisma.smartTrade.create({
      data,
      include: {
        orders: true,
        exchangeAccount: true,
      },
    });

    console.log(
      `[BotStoreAdapter] Smart Trade with (key:${ref}) was saved to DB`,
    );

    return toSmartTradeIteratorResult(toSmartTradeEntity(smartTrade));
  }

  async cancelSmartTrade(ref: string, botId: number) {
    console.log(`[BotStoreAdapter] cancelSmartTrade (ref:${ref})`);

    const bot = await xprisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot) {
      throw new Error(
        `[BotStoreAdapter] getSmartTrade(): botId ${botId} not found`,
      );
    }

    const smartTrade = await xprisma.smartTrade.findFirst({
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
      console.log("[BotStoreAdapter] SmartTrade not found");
      return false;
    }

    const processor = new SmartTradeProcessor(
      smartTrade,
      smartTrade.exchangeAccount,
    );

    await processor.cancelOrders();

    return true;
  }
}
