import { Module } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeAccountRepository } from 'src/core/db/firestore/repositories/exchange-account/exchange-account.repository';
import { GridBotCompletedDealsRepository } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/grid-bot-completed-deals.repository';
import { GridBotRepository } from 'src/core/db/firestore/repositories/grid-bot/grid-bot.repository';
import { GridBotEventsRepository } from 'src/core/db/firestore/repositories/grid-bot-events/grid-bot-events.repository';
import { UserRepository } from 'src/core/db/firestore/repositories/user/user.repository';
import { TwitterSignalsRepository } from 'src/core/db/firestore/repositories/marketplace/twitter-signals/twitter-signals.repository';
import { TwitterSignalEventsRepository } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/twitter-signal-events.repository';

@Module({
  imports: [],
  exports: [
    FirestoreService,
    UserRepository,
    ExchangeAccountRepository,
    GridBotRepository,
    GridBotEventsRepository,
    GridBotCompletedDealsRepository,
    TwitterSignalsRepository,
    TwitterSignalEventsRepository,
  ],
  providers: [
    FirestoreService,
    UserRepository,
    ExchangeAccountRepository,
    GridBotRepository,
    GridBotEventsRepository,
    GridBotCompletedDealsRepository,
    TwitterSignalsRepository,
    TwitterSignalEventsRepository,
  ],
})
export class FirestoreModule {}
