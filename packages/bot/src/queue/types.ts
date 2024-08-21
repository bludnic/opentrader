import type { TBotWithExchangeAccount } from '@opentrader/db';
import { MarketEvent, MarketId, MarketEventType } from "@opentrader/types";

export type OrderFilledEvent = {
  type: typeof MarketEventType.onOrderFilled;
  marketId: MarketId;
  orderId: number;
};

export type ProcessingEvent = MarketEvent | OrderFilledEvent;

export type QueueEvent = ProcessingEvent & { bot: TBotWithExchangeAccount; subscribedMarkets: MarketId[] };
