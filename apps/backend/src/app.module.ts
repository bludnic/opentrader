import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { Environment } from 'src/common/enums/environment.enum';
import {
  winstonJsonConsoleTransport,
  winstonNestLikeTransport,
} from 'src/common/helpers/logging/logging-transports';
import { FirebaseUserMiddleware } from 'src/common/middlewares/firebase-user.middleware';
import { bullMQConfig } from 'src/config/bullmq.config';
import { marketsApiConfig } from 'src/config/markets-api.config';
import { getTypeOrmConfig } from 'src/config/utils/getTypeOrmConfig';
import { postgresConfig } from 'src/config/postgres.config';
import { envValidationSchema } from 'src/config/utils/envValidationSchema';
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
import { QueueModule } from 'src/queue/queue.module';
import { TrpcModule } from 'src/trpc/trpc.module';
import { TweetTradingModule } from 'src/tweet-trading-bot/tweet-trading.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SmartTradingModule } from './smart-trading/smart-trading.module';
import { TradeBotModule } from './trade-bot/trade-bot.module';
import { TradeBotController } from './trade-bot/trade-bot.controller';
import { SmartTradingController } from './smart-trading/smart-trading.controller';
import { BacktestingModule } from './backtesting/backtesting.module';
import { SymbolsModule } from './symbols/symbols.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
      load: [postgresConfig, bullMQConfig, marketsApiConfig],
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
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
    BullModule.forRoot({
      connection: bullMQConfig(),
    }),
    QueueModule,
    ScheduleModule.forRoot(),
    CoreModule,
    GridBotModule,
    ExchangeAccountsModule,
    AppModule,
    MarketplaceModule,
    TweetTradingModule,
    SmartTradingModule,
    TradeBotModule,
    BacktestingModule,
    SymbolsModule,
    TrpcModule,
  ],
  providers: [gridBotServiceFactory, AppService, GridBotSyncService, Logger],
  controllers: [GridBotController, AppController],
})
export class AppModule implements NestModule {
  configure(consumer) {
    consumer
      .apply(FirebaseUserMiddleware)
      .forRoutes(
        SmartTradingController,
        GridBotController,
        TradeBotController,
        ExchangeAccountsController,
      );
  }
}
