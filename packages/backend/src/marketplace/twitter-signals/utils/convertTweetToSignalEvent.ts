import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { ITweetCoin } from 'src/core/db/types/entities/marketplace/twitter-signals/common/types/tweet-coin.interface';
import { IRecentTweet } from 'src/core/twitter-api/types/client/tweets-search-recent/types/recent-tweet.interface';
import { utcDateNowISO } from './utcDateNowISO';

export function convertTweetToSignalEvent(
  tweet: IRecentTweet,
  coins: ITweetCoin[],
  signalId: string,
): TwitterSignalEventDto {
  return {
    id: tweet.id, // maybe use nanoid
    signalId: signalId,
    parsedAt: utcDateNowISO(),
    coins,
    tweet,
  };
}
