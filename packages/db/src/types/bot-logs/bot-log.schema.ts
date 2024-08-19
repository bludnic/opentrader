import { z } from "zod";
import { zt } from "@opentrader/prisma";
import { StrategyAction, MarketEventType } from "@opentrader/types";

const ZCandlestick = z.object({
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  timestamp: z.number(),
}); // @todo should match ICandlestick interface

const ZMarketData = z.object({
  candle: ZCandlestick.optional(),
  candles: z.array(ZCandlestick),
}); // @todo should match MarketData interface

const ZStrategyError = z.object({
  message: z.string(),
  stack: z.string().optional(),
}); // @todo should match StrategyError type

export const ZBotLog = zt.BotLogSchema.extend({
  action: z.nativeEnum(StrategyAction),
  triggerEventType: z.nativeEnum(MarketEventType),
  context: ZMarketData.optional(),
  error: ZStrategyError.optional(),
});

export type TBotLog = z.infer<typeof ZBotLog>;
