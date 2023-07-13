import { Module } from '@nestjs/common';
import { ThreeCommasApiModule } from './3commas-api/3commas-api.module';

@Module({
  imports: [ThreeCommasApiModule],
  exports: [ThreeCommasApiModule],
  providers: [],
})
export class SharedModule {}
