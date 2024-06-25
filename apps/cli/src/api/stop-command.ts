import { findStrategy } from "@opentrader/bot-templates/server";
import { xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import { BotProcessing } from "@opentrader/processing";
import type { CommandResult, ConfigName } from "../types.js";
import { readBotConfig, readExchangesConfig } from "../config.js";

export async function stopCommand(options: {
  config: ConfigName;
}): Promise<CommandResult> {
  const config = readBotConfig(options.config);
  logger.debug(config, "Parsed bot config");

  const exchangesConfig = readExchangesConfig(options.config);
  logger.debug(exchangesConfig, "Parsed exchanges config");

  const botLabel = config.label || "default";

  const bot = await xprisma.bot.custom.findUnique({
    where: {
      label: botLabel,
    },
  });

  if (!bot) {
    logger.info(`Bot "${botLabel}" does not exists. Nothing to stop`);

    return {
      result: undefined,
    };
  }

  // check if bot strategy file exists
  try {
    await findStrategy(bot.template);
  } catch (err) {
    logger.info((err as Error).message);

    return {
      result: undefined,
    };
  }

  logger.info(`Processing stop command for bot "${bot.label}"...`);
  await stopBot(bot.id);
  logger.info(`Command stop processed successfully for bot "${bot.label}"`);

  return {
    result: undefined,
  };
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
