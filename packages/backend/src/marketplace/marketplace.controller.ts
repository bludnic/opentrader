import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';
import { TwitterApiClientService } from 'src/core/twitter-api/twitter-api-client.service';
import { TweetsSearchTweetField } from 'src/core/twitter-api/types/client/tweets-search-recent/enums/tweets-search-tweet-field.enum';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private twitterApi: TwitterApiClientService) {}

  @Get('signal')
  async signal(
    @Query('query') query: string,
    @Query('tweet.fields', ParseArrayPipe)
    tweetFields: TweetsSearchTweetField[],
  ) {
    const response = await this.twitterApi.searchRecentTweets({
      query,
      'tweet.fields': tweetFields,
    });

    return response.data;
  }
}
