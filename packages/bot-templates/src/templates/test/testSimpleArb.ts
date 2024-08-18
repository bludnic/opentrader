import { z } from "zod";
import { logger } from "@opentrader/logger";
import { TBotContext } from "@opentrader/bot-processor";

export function* testSimpleArb(ctx: TBotContext<any>) {
  logger.info("[testSimpleArb]: Ticker");

  const price1 = ctx.markets?.["BINANCE:UNI/USDT"]?.ticker?.ask;
  const price2 = ctx.markets?.["BYBIT:UNI/USDT"]?.ticker?.last;

  logger.info(`[UNI Price] Binance: ${price1} BYBIT: ${price2}`);
}

testSimpleArb.displayName = "Test Simple Arb";
testSimpleArb.hidden = true;
testSimpleArb.schema = z.object({});
testSimpleArb.watchers = {
  watchTicker: ["BINANCE:UNI/USDT", "BYBIT:UNI/USDT"],
};
testSimpleArb.runPolicy = {
  onTickerChange: true,
};
