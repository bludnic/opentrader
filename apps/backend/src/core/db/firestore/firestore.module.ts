import { Module } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ThreeCommasAccountRepository } from 'src/core/db/firestore/repositories/3commas-account/3commas-account.repository';
import { ExchangeAccountRepository } from 'src/core/db/firestore/repositories/exchange-account/exchange-account.repository';
import { GridBotRepository } from 'src/core/db/firestore/repositories/grid-bot/grid-bot.repository';
import { GridBotEventsRepository } from 'src/core/db/firestore/repositories/grid-bot-events/grid-bot-events.repository';
import { TweetTradingBotsRepository } from 'src/core/db/firestore/repositories/tweet-trading-bots/tweet-trading-bots.repository';
import { UserRepository } from 'src/core/db/firestore/repositories/user/user.repository';
import { TwitterSignalsRepository } from 'src/core/db/firestore/repositories/marketplace/twitter-signals/twitter-signals.repository';
import { TwitterSignalEventsRepository } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/twitter-signal-events.repository';
import { TradeBotRepository } from './repositories/trade-bot/trade-bot.repository';
import { SmartTradeRepository } from './repositories/smart-trade/smart-trade.repository';

@Module({
  imports: [],
  exports: [
    FirestoreService,
    UserRepository,
    ExchangeAccountRepository,
    GridBotRepository,
    GridBotEventsRepository,
    TwitterSignalsRepository,
    TwitterSignalEventsRepository,
    ThreeCommasAccountRepository,
    TweetTradingBotsRepository,
    SmartTradeRepository,
    TradeBotRepository,
  ],
  providers: [
    FirestoreService,
    UserRepository,
    ExchangeAccountRepository,
    GridBotRepository,
    GridBotEventsRepository,
    TwitterSignalsRepository,
    TwitterSignalEventsRepository,
    ThreeCommasAccountRepository,
    TweetTradingBotsRepository,
    SmartTradeRepository,
    TradeBotRepository,
  ],
})
export class FirestoreModule {}
