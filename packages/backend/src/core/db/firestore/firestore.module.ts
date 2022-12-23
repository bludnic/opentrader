import { Module } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeAccountRepository } from 'src/core/db/firestore/repositories/exchange-account/exchange-account.repository';
import { GridBotRepository } from 'src/core/db/firestore/repositories/grid-bot/grid-bot.repository';
import { UserRepository } from 'src/core/db/firestore/repositories/user/user.repository';

@Module({
  imports: [],
  exports: [
    FirestoreService,
    UserRepository,
    ExchangeAccountRepository,
    GridBotRepository,
  ],
  providers: [
    FirestoreService,
    UserRepository,
    ExchangeAccountRepository,
    GridBotRepository,
  ],
})
export class FirestoreModule {}
