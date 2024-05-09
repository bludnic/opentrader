import {
  BotProcessing,
  ExchangeAccountProcessor,
} from "@opentrader/processing";
import { xprisma } from "@opentrader/db";
import type { Context } from "../../../../utils/context";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
};

/**
 * 1. Sync orders statuses: `exchange -> db`
 * 2. Run bot template if any order status changed
 * 2. Place pending orders
 */
export async function syncClosedOrders({ ctx: _ }: Options) {
  const exchangeAccounts = await xprisma.exchangeAccount.findMany();

  for (const exchangeAccount of exchangeAccounts) {
    const processor = new ExchangeAccountProcessor(exchangeAccount);
    const { affectedBotsIds } = await processor.syncOrders();

    for (const botId of affectedBotsIds) {
      const bot = await BotProcessing.fromId(botId);

      await bot.process();
      await bot.placePendingOrders();
    }
  }

  return {
    ok: true,
  };
}
