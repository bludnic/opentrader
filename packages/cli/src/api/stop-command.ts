import { templates } from "@opentrader/bot-templates";
import { xprisma } from "@opentrader/db/dist";
import { logger } from "@opentrader/logger";
import { BotProcessing } from "@opentrader/processing";
import type { CommandResult, ConfigName } from "../types";
import { readBotConfig, readExchangesConfig } from "../config";

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

  const strategyExists = bot.template in templates;
  if (!strategyExists) {
    const availableStrategies = Object.keys(templates).join(", ");
    logger.info(
      `Strategy "${bot.template}" does not exists. Available strategies: ${availableStrategies}`,
    );

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
