import { Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { TwitterSignalDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signals/dto/twitter-signal.dto';
import { TwitterApiClientService } from 'src/core/twitter-api/twitter-api-client.service';
import { RecentTweetDto } from 'src/core/twitter-api/types/client/tweets-search-recent/dto/recent-tweet.dto';
import { IRecentTweet } from 'src/core/twitter-api/types/client/tweets-search-recent/types/recent-tweet.interface';
import { convertTweetToSignalEvent } from 'src/marketplace/twitter-signals/utils/convertTweetToSignalEvent';
import { filterActiveEvents } from 'src/marketplace/twitter-signals/utils/filterActiveEvents';

@Injectable()
export class TwitterSignalsService {
  constructor(
    private readonly twitterApi: TwitterApiClientService,
    private readonly firestore: FirestoreService,
    private readonly logger: Logger,
  ) {}

  public async parseNewTweets(
    signal: TwitterSignalDto,
  ): Promise<RecentTweetDto[]> {
    this.logger.debug(
      `[TwitterSignalsService] parseNewTweets() for SignalId: "${signal.id}" SignalQuery: "${signal.twitterQuery}"`,
      signal,
    );

    const res = await this.twitterApi.searchRecentTweets({
      query: signal.twitterQuery,
    });

    const tweets: IRecentTweet[] = res.data.data;

    this.logger.debug(
      `[TwitterSignalsService] Twitter API for query "${signal.twitterQuery}" returns ${tweets.length} tweets`,
      tweets,
    );
    for (const tweet of tweets) {
      const newSignalEvent = convertTweetToSignalEvent(tweet, signal.coins, signal.id);

      try {
        await this.firestore.marketplaceTwitterSignalEvents.createIfNotExists(
          newSignalEvent,
        );
        this.logger.debug(
          `[TwitterSignalsService] Save tweet ${tweet.id} as event to DB`,
          tweet,
        );
      } catch (err) {
        this.logger.debug(
          `[TwitterSignalsService] Save tweet ${tweet.id} as event to DB`,
          tweet,
        );
      }
    }

    this.logger.debug(
      `[TwitterSignalsService] Parsed successfully ${tweets.length} tweets`,
    );

    return tweets;
  }

  public async signalEvents(): Promise<TwitterSignalEventDto[]> {
    const signalEvents =
      await this.firestore.marketplaceTwitterSignalEvents.findAll();

    return signalEvents;
  }

  public async activeSignalEvents(): Promise<TwitterSignalEventDto[]> {
    const signalEvents =
      await this.firestore.marketplaceTwitterSignalEvents.findAll();
    const activeSignalEvents = filterActiveEvents(signalEvents);

    return activeSignalEvents;
  }
}
