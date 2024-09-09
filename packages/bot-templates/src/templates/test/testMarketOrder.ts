import { z } from "zod";
import { buy, cancelSmartTrade, IBotConfiguration, TBotContext } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* testMarketOrder(ctx: TBotContext<TestMarketOrderConfig, TestMarketOrderState>) {
  const { config: bot, onStart, onStop } = ctx;
  const { settings } = bot;

  if (onStart) {
    logger.info(bot, "[Test Market Order] Strategy started with params");

    yield buy({
      pair: bot.symbol,
      quantity: settings.quantityToBuy,
      orderType: "Market",
    });

    return;
  }

  if (onStop) {
    yield cancelSmartTrade("0");
    return;
  }

  logger.info(bot, "[Test Market Order] Strategy triggered");
}

testMarketOrder.displayName = "Test Market Order";
testMarketOrder.hidden = true;
testMarketOrder.schema = z.object({
  quantityToBuy: z.number().positive().default(0.001).describe("Quantity to buy"),
});
testMarketOrder.timeframe = ({ timeframe }: IBotConfiguration) => timeframe;
testMarketOrder.watchers = {
  watchCandles: ({ symbol }: IBotConfiguration) => symbol,
};
testMarketOrder.runPolicy = {
  onCandleClosed: true,
};

type TestMarketOrderState = {};
type TestMarketOrderConfig = IBotConfiguration<z.infer<typeof testMarketOrder.schema>>;
