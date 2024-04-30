import { z } from "zod";
import { IBotConfiguration, TBotContext } from "@opentrader/bot-processor";
import { calcGridLines } from "@opentrader/tools";

import { GridBotConfig, gridBot } from "./grid-bot";

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

gridBotLite.displayName = "Grid Bot Lite";
gridBotLite.schema = z.object({
  highPrice: z.number().positive().describe("Highest price of the grid"),
  lowPrice: z.number().positive().describe("Lowest price of the grid"),
  gridLevels: z.number().positive().describe("Number of grid lines"),
  quantityPerGrid: z
    .number()
    .positive()
    .describe("Quantity of base currency per each grid"),
});

export type GridBotLiteConfig = IBotConfiguration<
  z.infer<typeof gridBotLite.schema>
>;
