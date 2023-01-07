import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { TwitterSignalsController } from './twitter-signals.controller';
import { TwitterSignalEventsController } from './twitter-signal-events.controller';

@Module({
  imports: [CoreModule],
  exports: [],
  controllers: [TwitterSignalsController, TwitterSignalEventsController],
})
export class TwitterSignalsModule {}
