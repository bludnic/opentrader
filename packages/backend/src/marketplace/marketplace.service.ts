import { Injectable } from '@nestjs/common';
import { TwitterApiClientService } from 'src/core/twitter-api/twitter-api-client.service';

@Injectable()
export class MarketplaceService {
  constructor(private twitterApi: TwitterApiClientService) {}
}
