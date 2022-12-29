import { Injectable } from '@nestjs/common';
import { ExchangeAccountRepository } from 'src/core/db/firestore/repositories/exchange-account/exchange-account.repository';
import { GridBotCompletedDealsRepository } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/grid-bot-completed-deals.repository';
import { GridBotRepository } from 'src/core/db/firestore/repositories/grid-bot/grid-bot.repository';
import { GridBotEventsRepository } from 'src/core/db/firestore/repositories/grid-bot-events/grid-bot-events.repository';
import { UserRepository } from 'src/core/db/firestore/repositories/user/user.repository';

@Injectable()
export class FirestoreService {
  constructor(
    public user: UserRepository,
    public exchangeAccount: ExchangeAccountRepository,
    public gridBot: GridBotRepository,
    public gridBotEvents: GridBotEventsRepository,
    public gridBotCompletedDeals: GridBotCompletedDealsRepository,
  ) {}
}
