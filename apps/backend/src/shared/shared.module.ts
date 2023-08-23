import { Module } from '@nestjs/common';
import { ThreeCommasApiModule } from './3commas-api/3commas-api.module';
import { MarketsApiModule } from './markets-api/markets-api.module';

@Module({
  imports: [ThreeCommasApiModule, MarketsApiModule],
  exports: [ThreeCommasApiModule, MarketsApiModule],
  providers: [],
})
export class SharedModule {}
