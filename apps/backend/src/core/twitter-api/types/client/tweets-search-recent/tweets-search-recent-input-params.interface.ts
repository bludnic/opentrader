import { TweetsSearchSortOrder } from './enums/tweets-search-sort-order.enum';
import { TweetsSearchTweetField } from './enums/tweets-search-tweet-field.enum';
import { TweetsSearchUserField } from './enums/tweets-search-user-field.enum';
import { TweetsSearchPollField } from './enums/tweets-search-poll-field.enum';
import { TweetsSearchPlaceField } from './enums/tweets-search-place-field.enum';
import { TweetsSearchMediaField } from './enums/tweets-search-media-field.enum';
import { TweetsSearchExpansion } from './enums/tweets-search-expansion.enum';

/**
 * @see https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
 */
export interface ITweetsSearchRecentInputParams {
  /**
   * One query for matching Tweets.
   */
  query: string;

  /**
   * date (ISO 8601)
   */
  start_time?: string;

  /**
   * date (ISO 8601)
   */
  end_time?: string;

  /**
   * Expansions enable you to request additional data objects that relate to the originally returned Tweets.
   */
  expansions?: TweetsSearchExpansion[];

  /**
   * The maximum number of search results to be returned by a request.
   * A number between `10` and `100`. By default, a request response will return `10` results.
   */
  max_results?: number;

  /**
   * This fields parameter enables you to select which specific media fields will deliver in each returned Tweet.
   * Specify the desired fields in a comma-separated list without spaces between commas and fields
   */
  'media.fields'?: TweetsSearchMediaField[];

  /**
   * This parameter is used to get the next 'page' of results.
   * The value used with the parameter is pulled directly from
   * the response provided by the API, and should not be modified.
   */
  next_token?: string;

  /**
   * This fields parameter enables you to select which specific
   * place fields will deliver in each returned Tweet
   */
  'place.fields'?: TweetsSearchPlaceField[];

  /**
   * This fields parameter enables you to select which specific
   * poll fields will deliver in each returned Tweet.
   */
  'poll.fields'?: TweetsSearchPollField[];

  /**
   * Returns results with a Tweet ID greater than (that is, more recent than) the specified ID.
   */
  since_id?: string;

  /**
   * This parameter is used to specify the order in which you want the Tweets returned.
   * By default, a request will return the most recent Tweets first (sorted by recency).
   */
  sort_order?: TweetsSearchSortOrder[];

  /**
   * This fields parameter enables you to select which specific Tweet fields will deliver in each returned Tweet object.
   * Specify the desired fields in a comma-separated list without spaces between commas and fields
   */
  'tweet.fields'?: TweetsSearchTweetField[];

  /**
   * Returns results with a Tweet ID less than (that is, older than) the specified ID.
   * The ID specified is exclusive and responses will not include it.
   */
  until_id?: string;

  /**
   * This fields parameter enables you to select which specific user fields will deliver in each returned Tweet.
   */
  'user.fields'?: TweetsSearchUserField[];
}
