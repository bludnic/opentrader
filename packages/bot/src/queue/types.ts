import type { TBot } from "@opentrader/db";
import { ICandlestick, IOrderbook, ITicker, ITrade, StrategyTriggerEventType } from "@opentrader/types";

export type OrderFilledEvent = {
  type: typeof StrategyTriggerEventType.onOrderFilled;
  orderId: number;
};

export type CandleClosedEvent = {
  type: typeof StrategyTriggerEventType.onCandleClosed;
  candle: ICandlestick; // current closed candle
  candles: ICandlestick[]; // previous candles history
};

export type PublicTradeEvent = {
  type: typeof StrategyTriggerEventType.onPublicTrade;
  trade: ITrade;
};

export type OrderbookChangeEvent = {
  type: typeof StrategyTriggerEventType.onOrderbookChange;
  orderbook: IOrderbook;
};

export type TickerChangeEvent = {
  type: typeof StrategyTriggerEventType.onTickerChange;
  ticker: ITicker;
};

export type ProcessingEvent =
  | OrderFilledEvent
  | CandleClosedEvent
  | PublicTradeEvent
  | OrderbookChangeEvent
  | TickerChangeEvent;

export type QueueEvent = ProcessingEvent & { bot: TBot };
