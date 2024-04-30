import { IBotConfiguration, TBotContext } from "@opentrader/bot-processor";
import { calcGridLines } from "@opentrader/tools";

import { GridBotConfig, gridBot } from "./grid-bot";

export type GridBotLiteConfig = IBotConfiguration<{
  highPrice: number;
  lowPrice: number;
  /**
   * Number of grid lines
   */
  gridLevels: number;
  /**
   * Quantity of base currency per each grid
   */
  quantityPerGrid: number;
}>;

/**
 * Wrapper for the `gridBot` template with a simplified configuration.
 * @param ctx - Bot context
 */
export function* gridBotLite(ctx: TBotContext<GridBotLiteConfig>) {
  const { config } = ctx;

  const gridLines = calcGridLines(
    config.settings.highPrice,
    config.settings.lowPrice,
    config.settings.gridLevels,
    config.settings.quantityPerGrid,
  );

  // Create a new context for the `gridBot` template
  const gridBotCtx: TBotContext<GridBotConfig> = {
    ...ctx,
    config: {
      ...ctx.config,
      settings: {
        gridLines,
      },
    },
  };

  yield* gridBot(gridBotCtx);
}
