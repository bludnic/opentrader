import { HttpModule } from '@nestjs/axios';
import { WinstonModule } from 'nest-winston';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { Environment } from 'src/common/enums/environment.enum';
import {
  winstonJsonConsoleTransport,
  winstonNestLikeTransport,
} from 'src/common/helpers/logging/logging-transports';
import { FirebaseUserMiddleware } from 'src/common/middlewares/firebase-user.middleware';
import { CoreModule } from 'src/core/core.module';
import { FirebaseModule } from 'src/core/firebase';
import { ExchangeAccountsController } from 'src/exchange-accounts/exchange-accounts.controller';
import { ExchangeAccountsModule } from 'src/exchange-accounts/exchange-accounts.module';
import { gridBotServiceFactory } from 'src/grid-bot/grid-bot-service.factory';
import { GridBotSyncService } from 'src/grid-bot/grid-bot-sync.service';
import { GridBotController } from 'src/grid-bot/grid-bot.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, Module, NestModule } from '@nestjs/common';
import { GridBotModule } from 'src/grid-bot/grid-bot.module';

@Module({
  imports: [
    HttpModule,
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDevelopment =
          config.get<string>('ENVIRONMENT') === Environment.Development;

        return {
          transports: [
            ...(isDevelopment
              ? [winstonNestLikeTransport]
              : [winstonJsonConsoleTransport]),
          ],
        };
      },
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential:
        process.env.NODE_ENV === 'production'
          ? undefined
          : './firebase-credentials.json',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CoreModule,
    GridBotModule,
    ExchangeAccountsModule,
    AppModule,
  ],
  providers: [gridBotServiceFactory, AppService, GridBotSyncService, Logger],
  controllers: [GridBotController, AppController],
})
export class AppModule implements NestModule {
  configure(consumer) {
    consumer
      .apply(FirebaseUserMiddleware)
      .forRoutes(GridBotController, ExchangeAccountsController);
  }
}
