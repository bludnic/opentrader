import { Logger, Module } from '@nestjs/common';
import { TelegramModule } from 'nestjs-telegram';
import { CoreModule } from 'src/core/core.module';
import { TELEGRAM_BOT_API_KEY } from 'src/marketplace/twitter-signals/constants';
import { TwitterSignalsService } from './twitter-signals.service';
import { TwitterSignalsWatcherService } from './twitter-signals-watcher.service';
import { TwitterSignalsController } from './twitter-signals.controller';
import { TwitterSignalEventsController } from './twitter-signal-events.controller';

@Module({
  imports: [CoreModule,TelegramModule.forRoot({
    botKey: TELEGRAM_BOT_API_KEY,
  })],
  exports: [TwitterSignalsService],
  providers: [Logger, TwitterSignalsService, TwitterSignalsWatcherService],
  controllers: [TwitterSignalsController, TwitterSignalEventsController],
})
export class TwitterSignalsModule {}
