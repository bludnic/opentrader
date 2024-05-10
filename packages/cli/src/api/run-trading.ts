import type { IBotConfiguration } from "@opentrader/bot-processor";
import { templates } from "@opentrader/bot-templates";
import type { ExchangeAccountWithCredentials } from "@opentrader/db/dist";
import { xprisma } from "@opentrader/db/dist";
import { logger } from "@opentrader/logger";
import { Processor } from "@opentrader/bot";
import type { Bot } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import type { CommandResult, ConfigName, ExchangeConfig } from "../types";
import { readBotConfig, readExchangesConfig } from "../config";

export async function runTrading(
  strategyName: keyof typeof templates,
  options: {
    config: ConfigName;
  },
): Promise<CommandResult> {
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

    return {
      result: undefined,
    };
  }

  // Saving exchange accounts to DB if not exists
  const exchangeAccounts: ExchangeAccountWithCredentials[] =
    await createOrUpdateExchangeAccounts(exchangesConfig);
  const bot = await createOrUpdateBot(strategyName, config, exchangeAccounts);

  const processor = new Processor(exchangeAccounts);
  await processor.onApplicationBootstrap();

  if (bot.enabled) {
    logger.info(`Bot "${bot.label}" is already enabled. Cancelling previous orders...`);
    await stopBot(bot.id);
    logger.info(`The bot state were cleared`);
  }

  await startBot(bot.id);
  logger.info(`Bot "${bot.label}" started`);

  return {
    result: undefined,
  };
}

/**
 * Save exchange accounts to DB if not exists
 * @param exchangesConfig - Exchange accounts configuration
 */
async function createOrUpdateExchangeAccounts(
  exchangesConfig: Record<string, ExchangeConfig>,
) {
  const exchangeAccounts: ExchangeAccountWithCredentials[] = [];

  for (const [exchangeLabel, exchangeData] of Object.entries(exchangesConfig)) {
    let exchangeAccount = await xprisma.exchangeAccount.findFirst({
      where: {
        label: exchangeLabel,
      },
    });

    if (exchangeAccount) {
      logger.info(
        `Exchange account "${exchangeLabel}" found in DB. Updating credentials...`,
      );

      exchangeAccount = await xprisma.exchangeAccount.update({
        where: {
          id: exchangeAccount.id,
        },
        data: {
          ...exchangeData,
          label: exchangeLabel,
          owner: {
            connect: {
              id: 1,
            },
          },
        },
      });

      logger.info(`Exchange account "${exchangeLabel}" updated`);
    } else {
      logger.info(
        `Exchange account "${exchangeLabel}" not found. Adding to DB...`,
      );

      exchangeAccount = await xprisma.exchangeAccount.create({
        data: {
          ...exchangeData,
          label: exchangeLabel,
          owner: {
            connect: {
              id: 1,
            },
          },
        },
      });

      logger.info(`Exchange account "${exchangeLabel}" created`);
    }

    exchangeAccounts.push(exchangeAccount);
  }

  return exchangeAccounts;
}

async function createOrUpdateBot<T = object>(
  strategyName: string,
  botConfig: IBotConfiguration<T>,
  exchangeAccounts: ExchangeAccountWithCredentials[],
): Promise<Bot> {
  const exchangeAccount = exchangeAccounts.find(
    (exchangeAccount) =>
      exchangeAccount.exchangeCode === botConfig.exchangeCode,
  );
  if (!exchangeAccount) {
    throw new Error(
      `Exchange account with code "${botConfig.exchangeCode}" not found to create the bot`,
    );
  }

  let bot = await xprisma.bot.findFirst({
    where: {
      label: botConfig.label,
    },
  });

  if (bot) {
    logger.info(`Bot "${botConfig.label}" found in DB. Updating...`);
    bot = await xprisma.bot.update({
      where: {
        id: bot.id,
      },
      data: {
        type: "Bot",
        name: "Default bot",
        label: botConfig.label,
        template: strategyName,
        baseCurrency: botConfig.baseCurrency,
        quoteCurrency: botConfig.quoteCurrency,
        settings: botConfig.settings as object,
        exchangeAccount: {
          connect: {
            id: exchangeAccount.id,
          },
        },
        owner: {
          connect: {
            id: 1,
          },
        },
      },
    });

    logger.info(`Bot "${botConfig.label}" updated`);
  } else {
    logger.info(`Bot "${botConfig.label}" not found. Adding to DB...`);
    bot = await xprisma.bot.create({
      data: {
        type: "Bot",
        name: "Default bot",
        label: botConfig.label,
        template: strategyName,
        baseCurrency: botConfig.baseCurrency,
        quoteCurrency: botConfig.quoteCurrency,
        settings: botConfig.settings as object,
        exchangeAccount: {
          connect: {
            id: exchangeAccount.id,
          },
        },
        owner: {
          connect: {
            id: 1,
          },
        },
      },
    });

    logger.info(`Bot "${botConfig.label}" created`);
  }

  return bot;
}

async function startBot(botId: number) {
  const botProcessor = await BotProcessing.fromId(botId);
  await botProcessor.processStartCommand();

  await enableBot(botId);

  await botProcessor.placePendingOrders();
}

async function enableBot(botId: number) {
  await xprisma.bot.custom.update({
    where: {
      id: botId,
    },
    data: {
      enabled: true,
    },
  });
}

async function stopBot(botId: number) {
  const botProcessor = await BotProcessing.fromId(botId);
  await botProcessor.processStopCommand();

  await disableBot(botId);
}

async function disableBot(botId: number) {
  await xprisma.bot.custom.update({
    where: {
      id: botId,
    },
    data: {
      enabled: false,
    },
  });
}
