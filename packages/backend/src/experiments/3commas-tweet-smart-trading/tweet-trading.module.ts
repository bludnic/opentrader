import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';
import { TweetTradingBotsRepository } from './db/repositories/tweet-trading-bots/tweet-trading-bots.repository';
import { TweetTradingDbService } from './db/tweet-trading-db.service';
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
    TweetTradingBotsRepository,
    TweetTradingDbService,
    TweetTradingService,
    exchangeFactory,
  ],
})
export class TweetTradingModule {}
