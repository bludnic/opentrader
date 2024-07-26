import { z } from "zod";
import type { ISymbolInfo } from "@opentrader/types";
import type { IExchange } from "@opentrader/exchanges";
import type { IBotConfiguration, TBotContext } from "@opentrader/bot-processor";
import { useExchange } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* debug(ctx: TBotContext<DebugStrategyConfig>) {
  const { config: bot, onStart, onStop } = ctx;
  const exchange: IExchange = yield useExchange();

  logger.debug("Hello world");

  if (onStart) {
    logger.info(`[DebugStrategy] Bot started. Using ${exchange.exchangeCode} exchange`);

    if (bot.settings.fetchSymbols) {
      const symbols: ISymbolInfo[] = yield exchange.getSymbols();
      logger.info(`[DebugStrategy] Fetched ${symbols.length} symbols`);
    } else {
      logger.info(`[DebugStrategy] Skipping fetching symbols (fetchSymbols=false)`);
    }

    return;
  }
  if (onStop) {
    logger.info(`[DebugStrategy] Bot stopped`);
    return;
  }

  logger.info(`[DebugStrategy] Run bot template`);
  logger.info(
    ctx.market.candles.map((candle) => new Date(candle.timestamp).toISOString()),
    `[DebugStrategy] Candles`,
  );

  logger.info(`[DebugStrategy] Bot template executed successfully`);
}

debug.displayName = "Debug Strategy";
debug.hidden = true;
debug.schema = z.object({
  fetchSymbols: z.boolean().optional(),
});
debug.requiredHistory = 15;

export type DebugStrategyConfig = IBotConfiguration<z.infer<typeof debug.schema>>;
