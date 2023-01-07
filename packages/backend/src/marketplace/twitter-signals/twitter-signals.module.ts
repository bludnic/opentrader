import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { TwitterSignalsService } from './twitter-signals.service';
import { TwitterSignalsWatcherService } from './twitter-signals-watcher.service';
import { TwitterSignalsController } from './twitter-signals.controller';
import { TwitterSignalEventsController } from './twitter-signal-events.controller';

@Module({
  imports: [CoreModule],
  exports: [],
  providers: [Logger, TwitterSignalsService, TwitterSignalsWatcherService],
  controllers: [TwitterSignalsController, TwitterSignalEventsController],
})
export class TwitterSignalsModule {}
