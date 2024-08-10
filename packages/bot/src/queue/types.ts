import type { TBot } from "@opentrader/db";
import { ICandlestick, StrategyTriggerEventType } from "@opentrader/types";

export type OrderFilledEvent = {
  type: typeof StrategyTriggerEventType.onOrderFilled;
  bot: TBot;
  orderId: number;
};

export type CandleClosedEvent = {
  type: typeof StrategyTriggerEventType.onCandleClosed;
  bot: TBot;
  candle: ICandlestick; // current closed candle
  candles: ICandlestick[]; // previous candles history
};

export type ProcessingEvent = OrderFilledEvent | CandleClosedEvent;
