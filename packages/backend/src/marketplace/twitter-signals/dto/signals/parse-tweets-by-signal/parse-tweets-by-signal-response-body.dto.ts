import { RecentTweetDto } from 'src/core/twitter-api/types/client/tweets-search-recent/dto/recent-tweet.dto';

export class ParseTweetsBySignalResponseBodyDto {
  parsedTweets: RecentTweetDto[];
}
