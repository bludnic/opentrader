import { cargoQueue, QueueObject, ErrorCallback } from "async";
import type { TBot } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
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

async function queueHandler(tasks: ProcessingEvent[], callback: ErrorCallback<Error>) {
  const event = tasks[tasks.length - 1]; // getting last task from the queue

  if (tasks.length > 1) {
    logger.info(`📠 Processing ${tasks.length} tasks of bot [id: ${event.bot.id} name: ${event.bot.name}]`);
  } else {
    logger.info(`📠 Processing ${tasks.length} task of bot [id: ${event.bot.id} name: ${event.bot.name}]`);
  }

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
}

const createQueue = () => cargoQueue<ProcessingEvent>(queueHandler);

class ProcessingQueue {
  queues: Record<TBot["id"], QueueObject<ProcessingEvent>> = {};

  push(event: ProcessingEvent) {
    // Create a queue bot if it doesn't exist
    if (!this.queues[event.bot.id]) {
      this.queues[event.bot.id] = createQueue();
      logger.info(`📠 Created queue for bot [id: ${event.bot.id} name: ${event.bot.name}]`);
    }

    const queue = this.queues[event.bot.id];
    queue.push(event);
  }
}

export const processingQueue = new ProcessingQueue();
