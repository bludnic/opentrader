import { z } from "zod";
import type { TBotContext } from "@opentrader/bot-processor";
import { useRSI } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* testRsi(ctx: TBotContext<any>) {
  if (ctx.onStart) {
    logger.info(`[TestRsi] Bot started`);
    return;
  }
  if (ctx.onStop) {
    logger.info(`[TestRsi] Bot stopped`);
    return;
  }

  logger.info("[TestRsi] Executing strategy template");
  const rsi: number = yield useRSI(7);
  logger.info(`[TestRsi] RSI value: ${rsi}`);

  if (rsi > 70) {
    logger.info(`[TestRsi] RSI is above 70. Time to sell!`);
  } else if (rsi < 30) {
    logger.info(`[TestRsi] RSI is below 30. Time to buy!`);
  } else {
    logger.info(`[TestRsi] RSI is in no trend. Do nothing.`);
  }
}

testRsi.displayName = "Test RSI";
testRsi.hidden = true;
testRsi.requiredHistory = 15;
testRsi.schema = z.object({});
