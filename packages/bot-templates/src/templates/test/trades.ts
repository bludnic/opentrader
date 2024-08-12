import { z } from "zod";
import { logger } from "@opentrader/logger";
import { buy, sell, TBotContext, useExchange } from "@opentrader/bot-processor";

export function* testTrades(ctx: TBotContext<any>) {
  logger.info("[TRADES]: Strategy exec");
  console.log("[TRADE]", ctx.market?.trade);
}

testTrades.displayName = "Trades Strategy";
testTrades.hidden = true;
testTrades.schema = z.object({});
testTrades.runPolicy = {
  watchTrades: ["BTC/USDT", "ETH/USDT"],
};
