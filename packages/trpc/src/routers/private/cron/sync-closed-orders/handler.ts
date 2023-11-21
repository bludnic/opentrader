import {
  ExchangeAccountProcessor,
  GridBotProcessor,
} from "@opentrader/processing";
import { xprisma } from "@opentrader/db";
import { Context } from "#trpc/utils/context";

type Options = {
  ctx: {
    user: NonNullable<Context["user"]>;
  };
};

/**
 * 1. Sync orders statuses: exchange -> db
 * 2. Run bot template if any order status changed
 * 2. Place pending orders
 */
export async function syncClosedOrders({ ctx }: Options) {
  const exchangeAccounts = await xprisma.exchangeAccount.findMany();

  for (const exchangeAccount of exchangeAccounts) {
    const processor = new ExchangeAccountProcessor(exchangeAccount);
    const { affectedBotsIds } = await processor.syncOrders();

    for (const botId of affectedBotsIds) {
      const bot = await GridBotProcessor.fromId(botId);

      await bot.process();
      await bot.placePendingOrders();
    }
  }

  return {
    ok: true,
  };
}
