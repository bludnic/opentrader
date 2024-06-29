import { templates } from "@opentrader/bot-templates";
import { BarSize } from "@opentrader/types";
import { logger } from "@opentrader/logger";
import { findStrategy } from "@opentrader/bot-templates/server";
import type { CommandResult, ConfigName } from "../types.js";
import { createClient } from "../server.js";
import { readBotConfig, readExchangesConfig } from "../config.js";
import { ExchangeAccountWithCredentials, xprisma } from "@opentrader/db";
import {
  createOrUpdateBot,
  createOrUpdateExchangeAccounts,
  resetProcessing,
} from "src/utils/bot.js";
import { tServer } from "../trpc.js";

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
  const daemon = createClient();

  const config = readBotConfig(options.config);
  logger.debug(config, "Parsed bot config");

  const exchangesConfig = readExchangesConfig(options.config);
  logger.debug(exchangesConfig, "Parsed exchanges config");

  let strategy: Awaited<ReturnType<typeof findStrategy>>;
  try {
    strategy = await findStrategy(strategyName);
  } catch (err) {
    logger.info((err as Error).message);

    return {
      result: undefined,
    };
  }

  let bot = await xprisma.bot.custom.findUnique({
    where: {
      label: config.label || "default",
    },
  });

  if (bot?.enabled) {
    logger.info(
      `Bot "${bot.label}" is already enabled. Cancelling previous orders...`,
    );
    await tServer.bot.stop({ botId: bot.id });

    logger.info(`The bot was stoped`);
  }

  if (bot?.processing) {
    logger.warn(
      `Bot "${bot.label}" is already processing. It could happen because previous process was interrupted.`,
    );
    await resetProcessing(bot.id);
    logger.warn(`The bot processing state was cleared`);
  }

  const exchangeAccounts: ExchangeAccountWithCredentials[] =
    await createOrUpdateExchangeAccounts(exchangesConfig);
  bot = await createOrUpdateBot(
    strategy.isCustom ? strategy.strategyFilePath : strategyName,
    options,
    config,
    exchangeAccounts,
  );

  const result = await daemon.startBot.mutate({ botId: bot.id });

  if (result) {
    logger.info(`Bot "${bot.label}" started succesfully`);
  } else {
    logger.error(`Bot "${bot.label}" failed to start. Check the daemon logs`);
  }

  return {
    result: undefined,
  };
}
