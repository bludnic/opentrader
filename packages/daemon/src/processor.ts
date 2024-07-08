import { logger } from "@opentrader/logger";
import { xprisma } from "@opentrader/db";
import { Processor } from "@opentrader/bot";

export async function createProcessor() {
  const exchangeAccounts = await xprisma.exchangeAccount.findMany();
  logger.info(`Found ${exchangeAccounts.length} exchange accounts`);

  const bot = await xprisma.bot.custom.findFirst({
    where: {
      label: "default",
    },
  });
  logger.info(`Found bot: ${bot ? bot.label : "none"}`);

  const processor = new Processor(exchangeAccounts, bot ? [bot] : []);
  await processor.onApplicationBootstrap();

  return processor;
}
