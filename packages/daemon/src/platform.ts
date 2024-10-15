import { logger } from "@opentrader/logger";
import { xprisma } from "@opentrader/db";
import { Platform } from "@opentrader/bot";

export async function bootstrapPlatform() {
  const exchangeAccounts = await xprisma.exchangeAccount.findMany();
  logger.info(`🏛️  Loaded ${exchangeAccounts.length} exchange account(s)`);

  const bot = await xprisma.bot.custom.findFirst({
    where: {
      label: "default",
    },
    include: { exchangeAccount: true },
  });
  logger.info(`🤖 Default bot: ${bot ? bot.label : "none"}`);

  const platform = new Platform(exchangeAccounts, bot ? [bot] : []);

  await platform.bootstrap();

  return platform;
}
