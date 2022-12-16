import { HttpModule } from '@nestjs/axios';
import { ExchangeAccountMiddleware } from 'src/common/middlewares/exchange-account.middleware';
import { CoreModule } from 'src/core/core.module';
import { gridBotServiceFactory } from 'src/grid-bot/grid-bot-service.factory';
import { GridBotController } from 'src/grid-bot/grid-bot.controller';
import { FirebaseModule } from 'nestjs-firebase';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { Module, NestModule } from '@nestjs/common';
import { GridBotModule } from 'src/grid-bot/grid-bot.module';

@Module({
  imports: [
    HttpModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: './firebase-credentials.json',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CoreModule,
    GridBotModule,
  ],
  providers: [gridBotServiceFactory],
  controllers: [GridBotController],
})
export class AppModule implements NestModule {
  configure(consumer) {
    consumer.apply(ExchangeAccountMiddleware).forRoutes(GridBotController);
  }
}
