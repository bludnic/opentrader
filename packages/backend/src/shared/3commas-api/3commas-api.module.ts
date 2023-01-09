import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SmartTradesService } from 'src/shared/3commas-api/services/smart-trades.service';
import { ThreeCommasApiService } from 'src/shared/3commas-api/3commas-api.service';

@Module({
  imports: [HttpModule],
  exports: [SmartTradesService, ThreeCommasApiService],
  providers: [SmartTradesService, ThreeCommasApiService],
})
export class ThreeCommasApiModule {}
