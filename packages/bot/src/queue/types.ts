import type { TBot } from "@opentrader/db";
import { ICandlestick } from "@opentrader/types";

export const ExchangeEvent = {
  onOrderFilled: "onOrderFilled",
  onCandleClosed: "onCandleClosed",
} as const;
export type ExchangeEvent = (typeof ExchangeEvent)[keyof typeof ExchangeEvent];

export type OrderFilledEvent = {
  type: typeof ExchangeEvent.onOrderFilled;
  bot: TBot;
  orderId: number;
};

export type CandleClosedEvent = {
  type: typeof ExchangeEvent.onCandleClosed;
  bot: TBot;
  candle: ICandlestick; // current closed candle
  candles: ICandlestick[]; // previous candles history
};

export type ProcessingEvent = OrderFilledEvent | CandleClosedEvent;
