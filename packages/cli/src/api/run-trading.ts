import { templates } from "@opentrader/bot-templates";
import { logger } from "@opentrader/logger";
import { Processor } from "@opentrader/bot";
import { xprisma } from "@opentrader/db";
import type { TBot, ExchangeAccountWithCredentials } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import { BarSize } from "@opentrader/types";
import type {
  BotConfig,
  CommandResult,
  ConfigName,
  ExchangeConfig,
} from "../types";
import { readBotConfig, readExchangesConfig } from "../config";

type Options = {
  config: ConfigName;
  pair?: string;
  exchange?: string;
  timeframe?: BarSize;
};

export async function runTrading(
  strategyName: keyof typeof templates,
  options: Options,
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
  const bot = await createOrUpdateBot(
    strategyName,
    options,
    config,
    exchangeAccounts,
  );

  const processor = new Processor(exchangeAccounts, [bot]);
  await processor.onApplicationBootstrap();

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

async function createOrUpdateBot<T = any>(
  strategyName: string,
  options: Options,
  botConfig: BotConfig<T>,
  exchangeAccounts: ExchangeAccountWithCredentials[],
): Promise<TBot> {
  const exchangeLabel = options.exchange || botConfig.exchange;
  const botType = botConfig.type || "Bot";
  const botName = botConfig.name || "Default bot";
  const botLabel = botConfig.label || "default";
  const botTemplate = strategyName || botConfig.template;
  const botTimeframe = options.timeframe || botConfig.timeframe || null;
  const botPair = options.pair || botConfig.pair;
  const [baseCurrency, quoteCurrency] = botPair.split("/");

  const exchangeAccount = exchangeAccounts.find(
    (exchangeAccount) => exchangeAccount.label === exchangeLabel,
  );
  if (!exchangeAccount) {
    throw new Error(
      `Exchange account with label "${exchangeLabel}" not found. Check the exchanges config file.`,
    );
  }

  let bot = await xprisma.bot.custom.findFirst({
    where: {
      label: botLabel,
    },
  });

  if (bot) {
    logger.info(`Bot "${botLabel}" found in DB. Updating...`);

    bot = await xprisma.bot.custom.update({
      where: {
        id: bot.id,
      },
      data: {
        type: botType,
        name: botName,
        label: botLabel,
        template: botTemplate,
        timeframe: botTimeframe,
        baseCurrency,
        quoteCurrency,
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

    logger.info(`Bot "${botLabel}" updated`);
  } else {
    logger.info(`Bot "${botLabel}" not found. Adding to DB...`);
    bot = await xprisma.bot.custom.create({
      data: {
        type: botType,
        name: botName,
        label: botLabel,
        template: strategyName,
        timeframe: botTimeframe,
        baseCurrency,
        quoteCurrency,
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

    logger.info(`Bot "${botLabel}" created`);
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

async function resetProcessing(botId: number) {
  await xprisma.bot.custom.update({
    where: {
      id: botId,
    },
    data: {
      processing: false,
    },
  });
}
