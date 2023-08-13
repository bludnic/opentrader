import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from 'src/core/core.module';
import { gridBotServiceFactory } from 'src/grid-bot/grid-bot-service.factory';
import { GridBotController } from './grid-bot.controller';
import { GridBotService } from './grid-bot.service';

@Module({
  imports: [CoreModule, HttpModule],
  exports: [],
  controllers: [GridBotController],
  providers: [GridBotService, gridBotServiceFactory, Logger],
})
export class GridBotModule {}
