import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { OrderProcessor } from './processors/order.processor';
import { QueueController } from './queue.controller';

@Module({
  imports: [CoreModule],
  controllers: [QueueController],
  providers: [OrderProcessor],
})
export class QueueModule {}
