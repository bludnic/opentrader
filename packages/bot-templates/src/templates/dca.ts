import { z } from "zod";
import { logger } from "@opentrader/logger";
import { XOrderType } from "@opentrader/types";
import { useDca, cancelSmartTrade, IBotConfiguration, TBotContext } from "@opentrader/bot-processor";

export function* dca(ctx: TBotContext<DCABotConfig>) {
  const { config, onStart, onStop } = ctx;
  const { settings } = config;

  if (onStart) {
    logger.info(`[DCA] Bot strategy started on ${config.symbol} pair`);
    yield useDca({
      price: settings.entry.price,
      quantity: settings.entry.quantity,
      tpPercent: settings.tp.percent / 100,
      safetyOrders: settings.safetyOrders.map((so) => ({
        relativePrice: -so.deviation / 100,
        quantity: so.quantity,
      })),
    });
  }

  if (onStop) {
    yield cancelSmartTrade();
    logger.info(`[DCA] Bot with ${config.symbol} pair stopped`);

    return;
  }

  logger.info(
    {
      price: settings.entry.price,
      quantity: settings.entry.quantity,
      tpPercent: settings.tp.percent / 100,
      safetyOrders: settings.safetyOrders.map((so) => ({
        relativePrice: -so.deviation / 100,
        quantity: so.quantity,
      })),
    },
    `[DCA] Strategy executed`,
  );
}

dca.displayName = "DCA Bot";
dca.hidden = true;
dca.schema = z.object({
  entry: z.object({
    quantity: z.number().positive().describe("Quantity of the Entry Order in base currency").default(0.001),
    type: z.nativeEnum(XOrderType).describe("Entry with Limit or Market order").default(XOrderType.Market),
    price: z.number().optional(),
  }),
  tp: z.object({
    percent: z.number().positive().describe("Take Profit from entry order price in %").default(3),
  }),
  safetyOrders: z
    .array(
      z.object({
        quantity: z.number().positive().positive("Quantity of the Safety Order in base currency"),
        deviation: z.number().positive().positive("Price deviation from the Entry Order price in %"),
      }),
    )
    .default([
      { quantity: 0.002, deviation: 1 },
      { quantity: 0.003, deviation: 2 },
      { quantity: 0.004, deviation: 3 },
    ]),
});
dca.runPolicy = {
  onOrderFilled: true,
};

export type DCABotConfig = IBotConfiguration<z.infer<typeof dca.schema>>;
