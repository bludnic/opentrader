import type { TBot } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import { cargoQueue } from "async";
import { logger } from "@opentrader/logger";
import { ICandlestick } from "@opentrader/types";

export const ExchangeEvent = {
  onOrderFilled: "onOrderFilled",
  onCandleClosed: "onCandleClosed",
} as const;
export type ExchangeEvent = (typeof ExchangeEvent)[keyof typeof ExchangeEvent];

type OrderFilledEvent = {
  type: typeof ExchangeEvent.onOrderFilled;
  bot: TBot;
  orderId: number;
};

type CandleClosedEvent = {
  type: typeof ExchangeEvent.onCandleClosed;
  bot: TBot;
  candle: ICandlestick; // current closed candle
  candles: ICandlestick[]; // previous candles history
};

type ProcessingEvent = OrderFilledEvent | CandleClosedEvent;

export const processingQueue = cargoQueue<ProcessingEvent>(async (tasks, callback) => {
  if (tasks.length > 1) {
    logger.info(`📠 Batching ${tasks.length} tasks`);
  } else {
    logger.info(`📠 Processing ${tasks.length} task`);
  }

  // getting last task from the queue
  const event = tasks[tasks.length - 1];

  const botProcessor = new BotProcessing(event.bot);

  if (event.type === ExchangeEvent.onOrderFilled) {
    await botProcessor.process();
  } else if (event.type === ExchangeEvent.onCandleClosed) {
    await botProcessor.process({
      candle: event.candle,
      candles: event.candles,
    });
  } else {
    throw new Error(`❗ Unknown event type: ${event}`);
  }

  await botProcessor.placePendingOrders();

  callback();
});
