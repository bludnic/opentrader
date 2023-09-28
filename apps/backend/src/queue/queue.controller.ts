import { Body, Controller, Get, Post } from '@nestjs/common';
import { BullMQService } from 'src/core/bullmq/bullmq.service';

@Controller('queue')
export class QueueController {
  constructor(private bullmq: BullMQService) {}

  @Post('/order')
  async addOrder(@Body() body: { price: number; symbol: string }) {
    const { price, symbol } = body;

    const order = await this.bullmq.addOrder({ price, symbol });

    return {
      order,
    };
  }
}
