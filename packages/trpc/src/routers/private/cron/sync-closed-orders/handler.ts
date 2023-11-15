import { GridBotProcessor, OrdersSynchronizer } from "@opentrader/processing";
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
    const enabledBots = await xprisma.bot.findMany({
      where: {
        enabled: true,
        exchangeAccount: {
          id: exchangeAccount.id,
        },
      },
    });

    console.log(`Start syncing order statuses of "${exchangeAccount.name}"`);
    console.log(`Enabled bots ${enabledBots.length}:`);
    for (const bot of enabledBots) {
      console.log(`    #${bot.id}: ${bot.name}`);
    }

    // get uniq array of symbols across all enabled bots
    const symbols = enabledBots
      .map((bot) => `${bot.baseCurrency}/${bot.quoteCurrency}`)
      .filter((value, index, array) => array.indexOf(value) === index);

    for (const symbol of symbols) {
      const ordersSynchronizer = new OrdersSynchronizer(exchangeAccount);

      const { affectedBotsIds } = await ordersSynchronizer.syncBySymbol(symbol);

      for (const botId of affectedBotsIds) {
        const bot = await GridBotProcessor.fromId(botId);

        await bot.process();
        await bot.placePendingOrders();
      }
    }
  }

  return {
    ok: true,
  };
}
