import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { MarketsApiService } from './markets-api.service';

@Module({
  imports: [CoreModule],
  exports: [MarketsApiService],
  providers: [MarketsApiService],
})
export class MarketsApiModule {}
