import { Injectable } from '@nestjs/common';
import { TweetTradingBotsRepository } from './repositories/tweet-trading-bots/tweet-trading-bots.repository';

@Injectable()
export class TweetTradingDbService {
  constructor(public readonly bots: TweetTradingBotsRepository) {}
}
