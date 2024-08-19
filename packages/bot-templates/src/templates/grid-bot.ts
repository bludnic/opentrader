import { z } from "zod";
import type { IExchange } from "@opentrader/exchanges";
import type { IBotConfiguration, SmartTradeService, TBotContext } from "@opentrader/bot-processor";
import { cancelSmartTrade, useExchange, useSmartTrade } from "@opentrader/bot-processor";
import { computeGridLevelsFromCurrentAssetPrice } from "@opentrader/tools";
import type { IGetMarketPriceResponse } from "@opentrader/types";
import { logger } from "@opentrader/logger";

/**
 * Advanced grid bot template.
 * The template allows specifying grid lines with custom prices and quantities.
 */
export function* gridBot(ctx: TBotContext<GridBotConfig>) {
  const { config: bot, onStart, onStop } = ctx;
  const symbol = `${bot.baseCurrency}/${bot.quoteCurrency}`;

  const exchange: IExchange = yield useExchange();

  let price = 0;
  if (onStart) {
    const { price: markPrice }: IGetMarketPriceResponse = yield exchange.getMarketPrice({
      symbol: `${bot.baseCurrency}/${bot.quoteCurrency}`,
    });
    price = markPrice;
    logger.info(`[Grid] Bot strategy started on ${symbol} pair. Current price is ${price} ${bot.quoteCurrency}`);
  }

  const gridLevels = computeGridLevelsFromCurrentAssetPrice(bot.settings.gridLines, price);

  if (onStop) {
    for (const [index, _grid] of gridLevels.entries()) {
      yield cancelSmartTrade(`${index}`);
    }

    return;
  }

  for (const [index, grid] of gridLevels.entries()) {
    const smartTrade: SmartTradeService = yield useSmartTrade(
      {
        buy: {
          type: "Limit",
          price: grid.buy.price,
          status: grid.buy.status,
        },
        sell: {
          type: "Limit",
          price: grid.sell.price,
          status: grid.sell.status,
        },
        quantity: grid.buy.quantity, // or grid.sell.quantity
      },
      `${index}`,
    );

    if (smartTrade.isCompleted()) {
      yield smartTrade.replace();
    }
  }
}

gridBot.displayName = "Grid Bot";
gridBot.hidden = true;
gridBot.schema = z.object({
  gridLines: z.array(
    z.object({
      price: z.number().positive(),
      quantity: z.number().positive(),
    }),
  ),
});
gridBot.runPolicy = {
  onOrderFilled: true,
};

export type GridBotConfig = IBotConfiguration<z.infer<typeof gridBot.schema>>;
