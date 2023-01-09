import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { TweetTradingModule } from './3commas-tweet-smart-trading/tweet-trading.module';

@Module({
  imports: [CoreModule, SharedModule, TweetTradingModule],
  exports: [],
  controllers: [],
  providers: [Logger],
})
export class ExperimentsModule {}
