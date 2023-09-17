import { Module, Logger } from '@nestjs/common';

import { SmartTradePublisher } from './smart-trade.publisher';
import { ExchangeAccountsWatcher } from './exchange-accounts.watcher';
import { OrderSynchronizerPollingWatcher } from './order-synchronizer-polling.watcher';

@Module({
  imports: [],
  exports: [ExchangeAccountsWatcher],
  providers: [
    SmartTradePublisher,
    ExchangeAccountsWatcher,
    // OrderSynchronizerPollingWatcher,
    Logger,
  ],
})
export class ExchangeBusModule {}
