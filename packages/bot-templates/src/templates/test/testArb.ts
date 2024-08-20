import { z } from "zod";
import { IBotConfiguration, SmartTrade, type TBotContext, useArbTrade } from '@opentrader/bot-processor';
import { logger } from "@opentrader/logger";

export function* testArb(ctx: TBotContext<any>) {
  if (ctx.onStart) {
    logger.info("[TestArb] Executing strategy template");

    logger.info(`[TestArb] Main exchange: ${ctx.exchange.exchangeCode}`);
    logger.info(`[TestArb] Additional exchange: ${ctx.additionalExchanges[0].exchangeCode}`);

    const trade: SmartTrade = yield useArbTrade({
      quantity: 0.0001,
      exchange1: 1,
      exchange2: 3,
      symbol: "BTC/USDT",
    });

    logger.info(trade, "[TestArb] Placed ARB trade");
  }
}

testArb.schema = z.object({});
testArb.hidden = true;
testArb.watchers = {
  watchCandles: ({ symbol }: IBotConfiguration) => symbol,
};
testArb.runPolicy = {
  onCandleClosed: true,
};
