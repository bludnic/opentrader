import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { TwitterSignalsModule } from 'src/marketplace/twitter-signals/twitter-signals.module';
import { MarketplaceController } from './marketplace.controller';

@Module({
  imports: [CoreModule, TwitterSignalsModule],
  exports: [],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
