import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { tweetTradingServiceFactory } from 'src/tweet-trading-bot/tweet-trading-service.factory';
import { TweetTradingService } from './tweet-trading.service';
import { TweetTradingController } from './tweet-trading.controller';
import { MarketplaceModule } from 'src/marketplace/marketplace.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule, MarketplaceModule, HttpModule],
  exports: [],
  controllers: [TweetTradingController],
  providers: [
    Logger,
    TweetTradingService,
    exchangeFactory,
    tweetTradingServiceFactory,
  ],
})
export class TweetTradingModule {}
