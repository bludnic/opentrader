import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { TweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';
import { TwitterSignalsService } from 'src/marketplace/twitter-signals/twitter-signals.service';
import {
  TweetTradingServiceFactory,
  TweetTradingServiceFactorySymbol,
} from 'src/tweet-trading-bot/tweet-trading-service.factory';

@Injectable()
export class TweetTradingBotsWatcherService {
  constructor(
    private readonly twitterSignalsService: TwitterSignalsService,
    private readonly firestore: FirestoreService,
    @Inject(TweetTradingServiceFactorySymbol)
    private readonly tweetTradingServiceFactory: TweetTradingServiceFactory,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async matching() {
    this.logger.debug('[TweetTradingBotsWatcherService] Run matching');

    const report: Array<{
      bot: TweetTradingBotDto;
      signalEvent: TwitterSignalEventDto;
    }> = [];

    this.logger.debug(`Retrieving active signal events...`);
    const activeSignalEvents =
      await this.twitterSignalsService.activeSignalEvents();

    this.logger.debug(
      `Active signal events count: ${activeSignalEvents.length}`,
    );

    if (activeSignalEvents.length === 0) {
      this.logger.debug('No signal events. Skip process.');
      return report;
    }

    this.logger.debug('Retrieving active TweetTradingBots...');
    const activeBots = await this.firestore.tweetTradingBots.findAllEnabled();

    this.logger.debug(`Enabled bots count: ${activeBots.length}`);

    if (activeBots.length === 0) {
      this.logger.debug('No active bots. Skip process.');
      return report;
    }

    for (const bot of activeBots) {
      const tweetTradingService =
        await this.tweetTradingServiceFactory.fromBotId(bot.id);

      await tweetTradingService.runMatching(bot.id, activeSignalEvents);
    }

    this.logger.debug('Matched successfully');

    return report;

    this.logger.debug('[TweetTradingBotsWatcherService] Match process end');
  }
}
