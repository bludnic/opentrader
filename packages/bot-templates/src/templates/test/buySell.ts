import { z } from "zod";
import { buy, cancelSmartTrade, IBotConfiguration, sell, type TBotContext } from "@opentrader/bot-processor";
import { logger } from "@opentrader/logger";

export function* testBuySell(ctx: TBotContext<any>) {
  logger.info("[TestBuySell] Executing strategy template");

  if (ctx.onStop) {
    logger.info("[TestBuySell] Stopping strategy");
    yield cancelSmartTrade();
    return;
  }

  if (ctx.onStart) {
    yield cancelSmartTrade();
    logger.info("[TestBuySell] Cancelled previous smart trade");
  }

  if (Math.random() > 0.5) {
    yield buy({
      exchange: "OKX",
      pair: "BTC/USDT",
      quantity: 0.0001,
      price: 10000,
    });

    logger.info("[TestBuySell] Executed buy");
  } else {
    yield sell({
      exchange: "OKX",
      pair: "BTC/USDT",
      quantity: 0.0001,
      price: 90000,
    });

    logger.info("[TestBuySell] Executed sell");
  }
}

testBuySell.schema = z.object({});
testBuySell.hidden = true;
testBuySell.watchers = {
  watchCandles: ({ baseCurrency, quoteCurrency }: IBotConfiguration) => `${baseCurrency}/${quoteCurrency}`,
};
testBuySell.runPolicy = {
  onCandleClosed: true,
};
