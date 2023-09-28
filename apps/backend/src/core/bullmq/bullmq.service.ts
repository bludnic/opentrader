import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ORDERS_QUEUE_NAME } from './queues';

@Injectable()
export class BullMQService {
  constructor(
    @InjectQueue(ORDERS_QUEUE_NAME)
    private readonly queue: Queue,
  ) {}

  async addOrder(orderMetadata: { price: number; symbol: string }) {
    const job = await this.queue.add('myJobName', orderMetadata);

    return job;
  }
}
