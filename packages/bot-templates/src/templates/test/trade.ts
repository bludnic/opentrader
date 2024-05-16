import { useTrade, cancelSmartTrade } from "@opentrader/bot-processor";
import type { TradeService, TBotContext } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* testTrade(ctx: TBotContext<any>) {
  logger.info("[TestTrade] Executing strategy template");

  if (ctx.onStop) {
    logger.info("[TestTrade] Stopping strategy");
    yield cancelSmartTrade();
    return;
  }

  if (ctx.onStart) {
    yield cancelSmartTrade();
    logger.info("[TestTrade] Cancelled previous smart trade");
  }

  const trade: TradeService = yield useTrade({
    exchange: "OKX",
    pair: "BTC/USDT",
    side: "buy",
    quantity: 0.0001,
    price: 10000,
    tp: 100000,
  });

  logger.info(trade, "[TestTrade] Trade info");

  if (trade.isCompleted()) {
    logger.info("[TestTrade] Trade completed");
  }
}
