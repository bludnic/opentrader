import { z } from "zod";
import { cancelSmartTrade, TBotContext, useDca } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* testDca(ctx: TBotContext<any>) {
  if (ctx.onStart) {
    logger.info(`[Test DCA] Bot started`);
  }
  if (ctx.onStop) {
    logger.info(`[Test DCA] Bot stopped`);

    yield cancelSmartTrade();

    return;
  }

  logger.info("[Test DCA] Executing strategy template");
  yield useDca({
    quantity: 0.001,
    tpPercent: 0.03, // +3%
    safetyOrders: [
      { relativePrice: -0.01, quantity: 0.002 },
      { relativePrice: -0.02, quantity: 0.004 },
      { relativePrice: -0.03, quantity: 0.006 },
    ],
  });
}

testDca.displayName = "Test DCA";
testDca.hidden = true;
testDca.schema = z.object({});
