import { AxiosResponse } from 'axios';
import { TwitterApiResponse } from 'src/core/twitter-api/types/client/common/twitter-api-response';
import { ITweetsSearchRecentResponseData } from 'src/core/twitter-api/types/client/tweets-search-recent/tweets-search-recent-response-data.interface';
import { ITweetsSearchRecentMeta } from 'src/core/twitter-api/types/client/tweets-search-recent/types/tweets-search-recent-meta.interface';

/**
 * Twitter API doesn't return `data` property if no tweets was found.
 * Replace it with an empty array.
 *
 * @param response
 */
export function recentTweetsReplaceWithEmptyArrayIfDataIsUndefined(
  response: AxiosResponse<
    TwitterApiResponse<ITweetsSearchRecentResponseData, ITweetsSearchRecentMeta>
  >,
): AxiosResponse<
  TwitterApiResponse<ITweetsSearchRecentResponseData, ITweetsSearchRecentMeta>
> {
  const { data } = response.data;

  if (data === undefined) {
    return {
      ...response,
      data: {
        ...response.data,
        data: [],
      },
    };
  }

  return response
}
