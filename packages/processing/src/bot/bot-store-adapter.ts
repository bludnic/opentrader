import { CreateSmartTradePayload, IStore, SmartTrade } from "@opentrader/bot-processor";
import { xprisma, toSmartTradeEntity } from "@opentrader/db";
import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import { SmartTradeExecutor } from "../executors/index.js";
import { toPrismaSmartTrade, toSmartTradeIteratorResult } from "./utils/index.js";

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
    } catch (err) {
      return null; // throws error if not found
    }
  }

  async createSmartTrade(ref: string, payload: CreateSmartTradePayload, botId: number) {
    const bot = await xprisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot) {
      logger.error(
        `BotStoreAdapter: Cannot cancel SmartTrade with ref "${ref}". Reason: Bot with ID ${botId} not found.`,
      );

      throw new Error("Bot not found");
    }

    const data = toPrismaSmartTrade(payload, bot, ref);

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

    logger.info(`BotStoreAdapter: SmartTrade with ref "${ref}" created`);

    return toSmartTradeIteratorResult(toSmartTradeEntity(smartTrade));
  }

  async updateSmartTrade(
    ref: string,
    payload: Pick<CreateSmartTradePayload, "sell">,
    botId: number,
  ): Promise<SmartTrade | null> {
    if (!payload.sell) {
      logger.error(
        `BotStoreAdapter: Cannot update SmartTrade with ref "${ref}". Reason: "payload.sell" not provided. Payload: ${JSON.stringify(payload)}}`,
      );
      return null;
    }

    const bot = await xprisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot) {
      logger.error(
        `BotStoreAdapter: Cannot cancel SmartTrade with ref "${ref}". Reason: Bot with ID ${botId} not found.`,
      );
      return null;
    }

    try {
      let smartTrade = await xprisma.smartTrade.findFirstOrThrow({
        where: {
          type: "Trade",
          ref,
          bot: {
            id: bot.id,
          },
        },
        include: {
          orders: true,
          exchangeAccount: true,
        },
      });
      const entryOrder = smartTrade.orders.find((order) => order.entityType === "EntryOrder");

      if (!entryOrder) {
        throw new Error("EntryOrder not found in SmartTrade");
      }

      const tpOrder = smartTrade.orders.find((order) => order.entityType === "TakeProfitOrder");
      if (tpOrder) {
        logger.info(`BotStoreAdapter: Updating SmartTrade with "${ref}". TakeProfitOrder already placed. Skipping.`);

        return toSmartTradeIteratorResult(toSmartTradeEntity(smartTrade));
      }

      const symbol = payload.sell.symbol || bot.symbol;
      const exchangeAccountId = payload.sell.exchange || bot.exchangeAccountId;

      await xprisma.order.create({
        data: {
          entityType: "TakeProfitOrder",
          type: payload.sell.type,
          side: "Sell",
          price: payload.sell.price,
          quantity: entryOrder.quantity, // @todo multiply by 0.99 for safety amount
          symbol,
          smartTrade: {
            connect: {
              id: smartTrade.id,
            },
          },
          exchangeAccount: {
            connect: {
              id: exchangeAccountId,
            },
          },
        },
        include: {
          smartTrade: {
            include: {
              orders: true,
              exchangeAccount: true,
            },
          },
        },
      });

      smartTrade = await xprisma.smartTrade.update({
        where: {
          id: smartTrade.id,
        },
        data: {
          takeProfitType: "Order",
        },
        include: {
          orders: true,
          exchangeAccount: true,
        },
      });

      logger.info(`BotStoreAdapter: SmartTrade with ref "${ref}" updated. TakeProfitOrder placed.`);

      return toSmartTradeIteratorResult(toSmartTradeEntity(smartTrade));
    } catch (err) {
      console.log("An error occurred while updating SmartTrade", err);
      return null; // return null if smartTrade not found
    }
  }

  async cancelSmartTrade(ref: string, botId: number) {
    const bot = await xprisma.bot.findUnique({
      where: {
        id: botId,
      },
    });
    if (!bot) {
      logger.error(
        `BotStoreAdapter: Cannot cancel SmartTrade with ref "${ref}". Reason: Bot with ID ${botId} not found.`,
      );

      return false;
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
      logger.warn(`BotStoreAdapter: Cannot cancel SmartTrade with ref "${ref}". Reason: SmartTrade not found`);
      return false;
    }

    const smartTradeExecutor = SmartTradeExecutor.create(smartTrade, smartTrade.exchangeAccount);
    await smartTradeExecutor.cancelOrders();

    return true;
  }

  async getExchange(label: string) {
    const exchangeAccount = await xprisma.exchangeAccount.findFirst({
      where: {
        label,
      },
    });

    if (!exchangeAccount) {
      logger.error(`BotStoreAdapter: ExchangeAccount with label "${label}" not found`);
      return null;
    }

    return exchangeProvider.fromAccount(exchangeAccount);
  }
}
