import { cargoQueue, QueueObject } from "async";
import type { TBot } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import { logger } from "@opentrader/logger";
import { store } from "@opentrader/bot-store";
import { QueueEvent } from "./types.js";

async function queueHandler(tasks: QueueEvent[]) {
  const event = tasks[tasks.length - 1]; // getting last task from the queue

  if (tasks.length > 1) {
    logger.info(`📠 Batching ${tasks.length} tasks of bot [id: ${event.bot.id} name: ${event.bot.name}]`);
  } else {
    logger.info(`📠 Processing ${tasks.length} task of bot [id: ${event.bot.id} name: ${event.bot.name}]`);
  }

  const botProcessor = new BotProcessing(event.bot);

  await botProcessor.process({
    triggerEventType: event.type,
    market: store.getMarket(event.marketId),
    markets: store.markets,
  });

  await botProcessor.placePendingOrders();
}

const createQueue = () => cargoQueue<QueueEvent>(queueHandler);

class Queue {
  queues: Record<TBot["id"], QueueObject<QueueEvent>> = {};

  push(event: QueueEvent) {
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
