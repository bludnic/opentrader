import { Module } from '@nestjs/common';
import { MarketsApiModule } from './markets-api/markets-api.module';

@Module({
  imports: [MarketsApiModule],
  exports: [MarketsApiModule],
  providers: [],
})
export class SharedModule {}
