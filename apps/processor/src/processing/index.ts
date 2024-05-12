import { xprisma } from "@opentrader/db";
import { Processor } from "@opentrader/bot";

export class AppProcessor {
  private processor: Processor | null = null;

  async onApplicationBootstrap() {
    const exchangeAccounts = await xprisma.exchangeAccount.findMany();
    const bots = await xprisma.bot.custom.findMany({
      where: {
        enabled: true,
        timeframe: {
          not: null,
        },
      },
    });
    const timeframeBasedBots = bots.filter((bot) => bot.timeframe !== null);

    this.processor = new Processor(exchangeAccounts, timeframeBasedBots);
    await this.processor.onApplicationBootstrap();
  }

  async beforeApplicationShutdown() {
    await this.processor?.beforeApplicationShutdown();
  }
}

export const processor = new AppProcessor();
