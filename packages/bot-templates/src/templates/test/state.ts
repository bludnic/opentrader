import type { TBotContext } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* testState(ctx: TBotContext<any>) {
  const { config: bot, onStart, onStop } = ctx;

  if (onStart) {
    logger.info(ctx.state, `[TestState] Bot started`);

    return;
  }
  if (onStop) {
    logger.info(ctx.state, `[TestState] Bot stopped`);
    return;
  }

  if (ctx.state.counter === undefined) {
    ctx.state.counter = 0;
  }

  ctx.state.counter += 1;

  logger.info(ctx.state, `[TestState] State is`);
}

testState.displayName = "Test State";
