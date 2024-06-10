import { Server } from "jayson/promise";

import { Processor } from "@opentrader/bot";
import { ExchangeAccountWithCredentials, xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { BarSize } from "@opentrader/types";
import { templates } from "@opentrader/bot-templates";
import { readBotConfig, readExchangesConfig } from "../../config";
import {
  createOrUpdateBot,
  createOrUpdateExchangeAccounts,
  resetProcessing,
  startBot,
  stopBot,
} from "../../utils/bot";
import { ConfigName } from "../../types";

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

  server.http().listen(8000);
  logger.info("RPC Server started on port 8000");
}
void createApp();

type Options = {
  config: ConfigName;
  pair?: string;
  exchange?: string;
  timeframe?: BarSize;
};

const server = Server({
  async startBot(
    args: [
      strategyName: string,
      configName: ConfigName,
      pair?: string,
      exchange?: string,
      timeframe?: BarSize,
    ],
  ) {
    const [strategyName, configName, pair, exchange, timeframe] = args;
    const options = {
      strategyName,
      config: configName,
      pair,
      exchange,
      timeframe,
    };

    const config = readBotConfig(options.config);
    logger.debug(config, "Parsed bot config");

    const exchangesConfig = readExchangesConfig(options.config);
    logger.debug(exchangesConfig, "Parsed exchanges config");

    const strategyExists = strategyName in templates;
    if (!strategyExists) {
      const availableStrategies = Object.keys(templates).join(", ");
      logger.info(
        `Strategy "${strategyName}" does not exists. Available strategies: ${availableStrategies}`,
      );

      return false;
    }

    // Saving exchange accounts to DB if not exists
    const exchangeAccounts: ExchangeAccountWithCredentials[] =
      await createOrUpdateExchangeAccounts(exchangesConfig);
    const bot = await createOrUpdateBot(
      strategyName,
      options,
      config,
      exchangeAccounts,
    );

    await app?.restart();

    if (bot.enabled) {
      logger.info(
        `Bot "${bot.label}" is already enabled. Cancelling previous orders...`,
      );
      await stopBot(bot.id);
      logger.info(`The bot state was cleared`);
    }

    if (bot.processing) {
      logger.warn(
        `Bot "${bot.label}" is already processing. It could happen because previous process was interrupted.`,
      );
      await resetProcessing(bot.id);
      logger.warn(`The bot processing state was cleared`);
    }

    await startBot(bot.id);
    logger.info(`Bot "${bot.label}" started`);

    return true;
  },
  async stopBot(args: [configName: ConfigName]) {
    const [configName] = args;

    const config = readBotConfig(configName);
    logger.debug(config, "Parsed bot config");

    const exchangesConfig = readExchangesConfig(configName);
    logger.debug(exchangesConfig, "Parsed exchanges config");

    const botLabel = config.label || "default";

    const bot = await xprisma.bot.custom.findUnique({
      where: {
        label: botLabel,
      },
    });

    if (!bot) {
      logger.info(`Bot "${botLabel}" does not exists. Nothing to stop`);

      return false;
    }

    const strategyExists = bot.template in templates;
    if (!strategyExists) {
      const availableStrategies = Object.keys(templates).join(", ");
      logger.info(
        `Strategy "${bot.template}" does not exists. Available strategies: ${availableStrategies}`,
      );

      return false;
    }

    logger.info(`Processing stop command for bot "${bot.label}"...`);
    await stopBot(bot.id);
    logger.info(`Command stop processed successfully for bot "${bot.label}"`);

    return true;
  },
});

async function shutdown() {
  logger.info("SIGTERM received");

  if (app) {
    await app.destroy();
    logger.info("App shutted down gracefully.");
  }

  server.http().close();
  logger.info("RPC Server shutted down gracefully.");

  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
