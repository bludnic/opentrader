import { Module, Logger } from '@nestjs/common';

import { SmartTradePublisher } from './smart-trade.publisher';
import { ExchangeAccountsWatcher } from './exchange-accounts.watcher';

@Module({
  imports: [],
  exports: [ExchangeAccountsWatcher],
  providers: [SmartTradePublisher, ExchangeAccountsWatcher, Logger],
})
export class ExchangeBusModule {}
