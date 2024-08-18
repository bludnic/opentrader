import type { TBot } from "@opentrader/db";
import { MarketEvent, MarketId, StrategyTriggerEventType } from "@opentrader/types";

export type OrderFilledEvent = {
  type: typeof StrategyTriggerEventType.onOrderFilled;
  marketId: MarketId;
  orderId: number;
};

export type ProcessingEvent = MarketEvent | OrderFilledEvent;

export type QueueEvent = ProcessingEvent & { bot: TBot };
