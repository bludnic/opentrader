import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TweetTradingService } from './tweet-trading.service';

@Injectable()
export class TweetTradingBotsWatcherService {
  constructor(
    private readonly tweetTradingService: TweetTradingService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async matching() {
    this.logger.debug('[TweetTradingBotsWatcherService] Run matching');
    await this.tweetTradingService.runMatching();
    this.logger.debug('[TweetTradingBotsWatcherService] Match process end');
  }
}
