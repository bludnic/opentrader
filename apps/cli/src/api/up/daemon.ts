import { Processor } from "@opentrader/bot";
import { xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import type { BarSize } from "@opentrader/types";
import type { ConfigName } from "../../types.js";
import { createServer } from "../../server.js";

let app: App | null = null;

class App {
  constructor(private processor: Processor) {}

  static async create() {
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

    return new App(processor);
  }

  async destroy() {
    if (this.processor) {
      await this.processor.beforeApplicationShutdown();
    }
  }

  async restart() {
    await this.destroy();

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
  }
}

async function createApp() {
  app = await App.create();
  logger.info("App created");

  server.listen(8000);
  logger.info("RPC Server started on port 8000");
}
void createApp();

type Options = {
  config: ConfigName;
  pair?: string;
  exchange?: string;
  timeframe?: BarSize;
};

const server = createServer();

async function shutdown() {
  logger.info("SIGTERM received");

  if (app) {
    await app.destroy();
    logger.info("App shutted down gracefully.");
  }

  server.close();
  logger.info("Express Server shutted down gracefully.");

  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
