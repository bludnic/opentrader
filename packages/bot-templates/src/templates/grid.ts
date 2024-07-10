import { z } from "zod";
import type { IBotConfiguration, TBotContext } from "@opentrader/bot-processor";
import { calcGridLines } from "@opentrader/tools";
import type { GridBotConfig } from "./grid-bot.js";
import { gridBot } from "./grid-bot.js";

/**
 * Wrapper for the `gridBot` template with a simplified configuration.
 * @param ctx - Bot context
 */
export function* grid(ctx: TBotContext<GridBotLiteConfig>) {
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

grid.displayName = "Grid Bot Lite";
grid.schema = z.object({
  highPrice: z.number().positive().describe("Highest price of the grid"),
  lowPrice: z.number().positive().describe("Lowest price of the grid"),
  gridLevels: z.number().positive().describe("Number of grid lines"),
  quantityPerGrid: z
    .number()
    .positive()
    .describe("Quantity of base currency per each grid"),
});

export type GridBotLiteConfig = IBotConfiguration<z.infer<typeof grid.schema>>;
