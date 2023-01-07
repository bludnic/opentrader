import { IRecentTweet } from 'src/core/twitter-api/types/client/tweets-search-recent/types/recent-tweet.interface';

export class RecentTweetDto implements IRecentTweet {
  author_id: string;
  id: string;
  text: string;
  created_at: string;
}
