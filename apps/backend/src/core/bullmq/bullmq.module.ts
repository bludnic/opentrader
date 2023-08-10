import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Queue } from 'bullmq';
import { GLOBAL_PREFIX } from 'src/common/constants';
import { ORDERS_QUEUE_NAME } from './queues';
import { BullMQService } from './bullmq.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ORDERS_QUEUE_NAME,
    }),
  ],
  providers: [BullMQService],
  exports: [BullMQService],
})
// Thank to: https://github.com/felixmosh/bull-board/issues/303#issuecomment-930530407
export class BullMQModule implements NestModule {
  constructor(
    @InjectQueue(ORDERS_QUEUE_NAME)
    private readonly queue: Queue,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();

    const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard(
      {
        queues: [new BullAdapter(this.queue)],
        serverAdapter,
      },
    );

    serverAdapter.setBasePath(`/${GLOBAL_PREFIX}/admin/queues`);
    consumer.apply(serverAdapter.getRouter()).forRoutes('/admin/queues');
  }
}
