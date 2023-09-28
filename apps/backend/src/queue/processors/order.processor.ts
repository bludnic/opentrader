import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { OnApplicationShutdown } from '@nestjs/common';
import { Job } from 'bullmq';
import { delay } from 'src/common/helpers/delay';
import { ORDERS_QUEUE_NAME } from 'src/core/bullmq/queues';

@Processor(ORDERS_QUEUE_NAME)
export class OrderProcessor
  extends WorkerHost
  implements OnApplicationShutdown
{
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Job ${job.id} started processing`);
    await job.updateProgress(10);
    await delay(3000);
    await job.updateProgress(25);
    await delay(3000);
    await job.updateProgress(50);
    await delay(2000);
    await job.updateProgress(75);
    await delay(2000);
    await job.updateProgress(100);

    return 'result111';
  }

  @OnWorkerEvent('completed')
  onCompleted(arg) {
    console.log('Job completed', arg);
  }
}
