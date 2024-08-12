import { z } from "zod";
import { logger } from "@opentrader/logger";
import { buy, sell, TBotContext, useExchange } from "@opentrader/bot-processor";
import { IExchange } from "@opentrader/exchanges";
import { IGetMarketPriceResponse } from "@opentrader/types";

export function* okx(ctx: TBotContext<any>) {
  logger.info("[OKX STRATEGY]: Strategy exec");

  const exchange: IExchange = yield useExchange();

  const { price }: IGetMarketPriceResponse = yield exchange.getMarketPrice({ symbol: "BTC/USDT" });
  logger.info(`[OKX STRATEGY]: Market price: ${price}`);

  const result = yield sell({
    pair: "BTC/USDT",
    quantity: 0.0001,
    price: 10000, // much lower than current price
    orderType: "Limit",
  });

  console.log("[OKX STRATEGY]: Sell result", result);
}

okx.displayName = "OKX Strategy";
okx.hidden = true;
okx.schema = z.object({});
okx.runPolicy = {
  watchTrades: "BTC/USDT",
};
