import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { WinstonModule } from 'nest-winston';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { Environment } from 'src/common/enums/environment.enum';
import {
  winstonJsonConsoleTransport,
  winstonNestLikeTransport,
} from 'src/common/helpers/logging/logging-transports';
import { bullMQConfig } from 'src/config/bullmq.config';
import { marketsApiConfig } from 'src/config/markets-api.config';
import { envValidationSchema } from 'src/config/utils/envValidationSchema';
import { CoreModule } from 'src/core/core.module';
import { FirebaseModule } from 'src/core/firebase';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { ExchangeAccountsWatcher } from 'src/core/exchange-bus/exchange-accounts.watcher';
import { QueueModule } from 'src/queue/queue.module';
import { TrpcModule } from 'src/trpc/trpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
      load: [bullMQConfig, marketsApiConfig],
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
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
    AppModule,
    TrpcModule,
  ],
  providers: [AppService, Logger],
  controllers: [AppController],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private exchangeAccountsWatcher: ExchangeAccountsWatcher) {}

  async onApplicationBootstrap() {
    this.logger.log(
      'onApplicationBootstrap: ExchangeAccountsWatcher -> create()',
    );
    await this.exchangeAccountsWatcher.create();
  }

  async beforeApplicationShutdown() {
    this.logger.log(
      'beforeApplicationShutdown: ExchangeAccountsWatcher -> destroy()',
    );
    await this.exchangeAccountsWatcher.destroy();
  }
}
