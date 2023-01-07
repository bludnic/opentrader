import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TwitterSignalsService } from './twitter-signals.service';

@Injectable()
export class TwitterSignalsWatcherService {
  constructor(
    private readonly twitterSignalsService: TwitterSignalsService,
    private readonly firestore: FirestoreService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async parse() {
    const startParsingTime = new Date().toISOString();

    this.logger.debug(
      `[TwitterSignalsWatcherService] Start parsing process: ${startParsingTime}`,
    );

    const signals =
      await this.firestore.marketplaceTwitterSignals.findAllEnabled();

    if (signals.length === 0) {
      this.logger.debug(
        `[TwitterSignalsWatcherService] No enabled signals. Skip parsing process.`,
      );

      return;
    }

    this.logger.debug(
      `[TwitterSignalsWatcherService] Enabled signals: ${signals.length}`,
    );

    for (const signal of signals) {
      const startParsingTwitterAccountTime = new Date().toISOString();

      this.logger.debug(
        `[TwitterSignalsWatcherService] Start parsing tweets by signal: ${signal.id} (${signal.name}) at ${startParsingTwitterAccountTime}`,
      );

      await this.twitterSignalsService.parseNewTweets(signal);

      const endParsingTwitterAccountTime = new Date().toISOString();
      this.logger.debug(
        `[TwitterSignalsWatcherService] End parsing tweets at ${endParsingTwitterAccountTime}`,
      );
    }

    const endParsingTime = new Date().toISOString();
    this.logger.debug(
      `[TwitterSignalsWatcherService] End parsing process: ${endParsingTime}`,
    );
  }
}
