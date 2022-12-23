import { Injectable } from '@nestjs/common';
import { ExchangeAccountRepository } from 'src/core/db/firestore/repositories/exchange-account/exchange-account.repository';
import { GridBotRepository } from 'src/core/db/firestore/repositories/grid-bot/grid-bot.repository';
import { UserRepository } from 'src/core/db/firestore/repositories/user/user.repository';

@Injectable()
export class FirestoreService {
  constructor(
    public user: UserRepository,
    public exchangeAccount: ExchangeAccountRepository,
    public gridBot: GridBotRepository,
  ) {}
}
