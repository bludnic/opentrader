import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { threeCommasApiServiceFactory } from 'src/shared/3commas-api/3commas-api-service.factory';
import { SmartTradesService } from 'src/shared/3commas-api/services/smart-trades.service';

@Module({
  imports: [HttpModule, CoreModule],
  exports: [SmartTradesService, threeCommasApiServiceFactory],
  providers: [SmartTradesService, threeCommasApiServiceFactory, Logger],
})
export class ThreeCommasApiModule {}
