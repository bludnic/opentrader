import { findStrategy } from "@opentrader/bot-templates/server";
import { xprisma } from "@opentrader/db";
import { logger } from "@opentrader/logger";
import type { CommandResult, ConfigName } from "../types.js";
import { readBotConfig, readExchangesConfig } from "../config.js";
import { createClient } from "../daemon.js";

const daemon = createClient();

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

  logger.info(`Stopping bot "${bot.label}"...`);
  await daemon.bot.stop.mutate({ botId: bot.id });
  logger.info(`Bot "${bot.label}" stopped successfully`);

  return {
    result: undefined,
  };
}
