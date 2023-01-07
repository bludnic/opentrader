import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosPromise } from 'axios';
import { throwExceptionIfErrorHttpStatus } from 'src/core/twitter-api/utils/client/errors/throwExceptionIfErrorHttpStatus';
import { TwitterApiResponse } from './types/client/common/twitter-api-response';
import { ITweetsSearchRecentMeta } from './types/client/tweets-search-recent/types/tweets-search-recent-meta.interface';
import { ITweetsSearchRecentInputParams } from './types/client/tweets-search-recent/tweets-search-recent-input-params.interface';
import { ITweetsSearchRecentResponseData } from './types/client/tweets-search-recent/tweets-search-recent-response-data.interface';

@Injectable()
export class TwitterApiClientService {
  private apiUrl = 'https://api.twitter.com/2';

  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  searchRecentTweets(
    params: ITweetsSearchRecentInputParams,
  ): AxiosPromise<
    TwitterApiResponse<ITweetsSearchRecentResponseData, ITweetsSearchRecentMeta>
  > {
    const METHOD = 'GET';
    const REQUEST_PATH = '/tweets/search/recent';

    const requestUrlParams = new URLSearchParams();
    if (params.query) requestUrlParams.set('query', params.query);
    if (params['tweet.fields'])
      requestUrlParams.set('tweet.fields', params['tweet.fields'].join(','));

    const requestPathWithParams = `${REQUEST_PATH}${
      requestUrlParams.toString() ? `?${requestUrlParams}` : ''
    }`;

    const fullRequestUrl = `${this.apiUrl}${requestPathWithParams}`;

    return this.httpService
      .request<
        TwitterApiResponse<
          ITweetsSearchRecentResponseData,
          ITweetsSearchRecentMeta
        >
      >({
        method: METHOD,
        url: fullRequestUrl,
        headers: {
          Authorization: `Bearer ${this.config.get<string>(
            'MARKETPLACE_TWITTER_AUTH_BEARER_TOKEN',
          )}`,
        },
      })
      .toPromise()
      .catch(throwExceptionIfErrorHttpStatus(fullRequestUrl));
  }
}
