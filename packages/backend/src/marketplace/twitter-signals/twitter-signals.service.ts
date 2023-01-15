import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { TwitterSignalDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signals/dto/twitter-signal.dto';
import { TwitterApiClientService } from 'src/core/twitter-api/twitter-api-client.service';
import { RecentTweetDto } from 'src/core/twitter-api/types/client/tweets-search-recent/dto/recent-tweet.dto';
import { TweetsSearchTweetField } from 'src/core/twitter-api/types/client/tweets-search-recent/enums/tweets-search-tweet-field.enum';
import { IRecentTweet } from 'src/core/twitter-api/types/client/tweets-search-recent/types/recent-tweet.interface';
import { TELEGRAM_CHANNEL_ID } from 'src/marketplace/twitter-signals/constants';
import { convertTweetToSignalEvent } from 'src/marketplace/twitter-signals/utils/convertTweetToSignalEvent';
import { filterActiveEvents } from 'src/marketplace/twitter-signals/utils/filterActiveEvents';

@Injectable()
export class TwitterSignalsService {
  constructor(
    private readonly twitterApi: TwitterApiClientService,
    private readonly firestore: FirestoreService,
    private readonly logger: Logger,
    private readonly telegram: TelegramService
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
      'tweet.fields': [
        TweetsSearchTweetField.AuthorId,
        TweetsSearchTweetField.CreatedAt,
        TweetsSearchTweetField.Text,
      ],
    });

    const tweets: IRecentTweet[] = res.data.data;

    this.logger.debug(
      `[TwitterSignalsService] Twitter API for query "${signal.twitterQuery}" returns ${tweets.length} tweets`,
      tweets,
    );
    for (const tweet of tweets) {
      const newSignalEvent = convertTweetToSignalEvent(
        tweet,
        signal.coin,
        signal.id,
      );

      try {
        const { isNew } = await this.firestore.marketplaceTwitterSignalEvents.createIfNotExists(
          newSignalEvent,
        );

        if (isNew) {
          this.logger.debug(
            `[TwitterSignalsService] Tweet event ${tweet.id} saved successfully into DB`,
            tweet,
          );
        } else {
          this.logger.debug(
            `[TwitterSignalsService] Tweet event ${tweet.id} already exists in DB`,
            tweet,
          );
        }

        if (isNew) {
          await this.messageTelegramChannel(signal, newSignalEvent)
        }
      } catch (err) {
        this.logger.debug(
          `[TwitterSignalsService] Save tweet error ${tweet.id} as event to DB`,
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

  private async messageTelegramChannel(signal: TwitterSignalDto, signalEvent: TwitterSignalEventDto): Promise<void> {
    this.logger.debug(`Send message to telegram with Tweet ID ${signalEvent.tweet.id} to Telegram Channel ${TELEGRAM_CHANNEL_ID}`);
    const telegramMessage = await this.telegram.sendMessage({
      chat_id: TELEGRAM_CHANNEL_ID,
      text: `
${signal.description}

${signalEvent.tweet.text}

<b>Signal ID</b>: ${signal.id}
<b>Tweet ID</b>: <a href="https://twitter.com/${signalEvent.tweet.author_id}/status/${signalEvent.tweet.id}">${signalEvent.tweet.id}</a>
`,
      parse_mode: 'html'
    }).toPromise()
    this.logger.debug(`Telegram message MESSAGE_ID:${telegramMessage.message_id} sent successfully`);
  }
}
