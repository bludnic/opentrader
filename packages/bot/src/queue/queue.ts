import { cargoQueue, QueueObject } from "async";
import type { TBot } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import { logger } from "@opentrader/logger";
import { ProcessingEvent } from "./types.js";

async function queueHandler(tasks: ProcessingEvent[]) {
  const event = tasks[tasks.length - 1]; // getting last task from the queue

  if (tasks.length > 1) {
    logger.info(`📠 Processing ${tasks.length} tasks of bot [id: ${event.bot.id} name: ${event.bot.name}]`);
  } else {
    logger.info(`📠 Processing ${tasks.length} task of bot [id: ${event.bot.id} name: ${event.bot.name}]`);
  }

  const botProcessor = new BotProcessing(event.bot);

  if (event.type === "onOrderFilled") {
    await botProcessor.process({
      triggerEventType: event.type,
    });
  } else if (event.type === "onCandleClosed") {
    await botProcessor.process({
      triggerEventType: event.type,
      market: {
        candle: event.candle,
        candles: event.candles,
      },
    });
  } else {
    throw new Error(`❗ Unknown event type: ${event}`);
  }

  await botProcessor.placePendingOrders();
}

const createQueue = () => cargoQueue<ProcessingEvent>(queueHandler);

class Queue {
  queues: Record<TBot["id"], QueueObject<ProcessingEvent>> = {};

  push(event: ProcessingEvent) {
    // Create a queue bot if it doesn't exist
    if (!this.queues[event.bot.id]) {
      this.queues[event.bot.id] = createQueue();
      this.queues[event.bot.id].error((error) => {
        logger.error(error, `An error occurred in the processing queue: ${error.message}`);
      });
      logger.info(`📠 Created queue for bot [id: ${event.bot.id} name: ${event.bot.name}]`);
    }

    const queue = this.queues[event.bot.id];
    void queue.push(event);
  }
}

export const processingQueue = new Queue();
