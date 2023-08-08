import { Module } from '@nestjs/common';
import { ThreeCommasAccountsService } from './3commas-accounts.service';
import { ThreeCommasAccountsController } from './3commas-accounts.controller';

import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  exports: [],
  providers: [ThreeCommasAccountsService],
  controllers: [ThreeCommasAccountsController],
})
export class ThreeCommasAccountsModule {}
