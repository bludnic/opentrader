import { Injectable } from '@nestjs/common';
import { ThreeCommasAccountRepository } from 'src/core/db/firestore/repositories/3commas-account/3commas-account.repository';
import { ExchangeAccountRepository } from 'src/core/db/firestore/repositories/exchange-account/exchange-account.repository';
import { GridBotCompletedDealsRepository } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/grid-bot-completed-deals.repository';
import { GridBotRepository } from 'src/core/db/firestore/repositories/grid-bot/grid-bot.repository';
import { GridBotEventsRepository } from 'src/core/db/firestore/repositories/grid-bot-events/grid-bot-events.repository';
import { TwitterSignalEventsRepository } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/twitter-signal-events.repository';
import { TwitterSignalsRepository } from 'src/core/db/firestore/repositories/marketplace/twitter-signals/twitter-signals.repository';
import { TweetTradingBotsRepository } from 'src/core/db/firestore/repositories/tweet-trading-bots/tweet-trading-bots.repository';
import { UserRepository } from 'src/core/db/firestore/repositories/user/user.repository';

@Injectable()
export class FirestoreService {
  constructor(
    public user: UserRepository,
    public exchangeAccount: ExchangeAccountRepository,
    public gridBot: GridBotRepository,
    public gridBotEvents: GridBotEventsRepository,
    public gridBotCompletedDeals: GridBotCompletedDealsRepository,
    public marketplaceTwitterSignals: TwitterSignalsRepository,
    public marketplaceTwitterSignalEvents: TwitterSignalEventsRepository,
    public threeCommasAccount: ThreeCommasAccountRepository,
    public tweetTradingBots: TweetTradingBotsRepository,
  ) {}
}
