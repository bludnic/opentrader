import { Module, Logger } from '@nestjs/common';

import { SmartTradePublisher } from './smart-trade.publisher';
import { SmartTradeSynchronizer } from './smart-trade.synchronizer';
import { SmartTradeService } from './smart-trade.service';

@Module({
  imports: [],
  exports: [],
  providers: [
    SmartTradeService,
    SmartTradePublisher,
    SmartTradeSynchronizer,
    Logger,
  ],
})
export class SmartTradeModule {}
