import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { exchangeFactory } from 'src/core/exchanges/exchange.factory';

import { TwitterSignalsService } from 'src/marketplace/twitter-signals/twitter-signals.service';
import { threeCommasApiServiceFactory } from 'src/shared/3commas-api/3commas-api-service.factory';
import { TweetTradingService } from './tweet-trading.service';
import { ITweetTradingContext } from './utils/contexts/tweet-trading-context.interface';

export const TweetTradingServiceFactorySymbol = Symbol(
  'TweetTradingServiceFactory',
);

export type TweetTradingServiceFactory = {
  fromContext: (exchange: ITweetTradingContext) => TweetTradingService;
  fromBotId: (botId: string) => Promise<TweetTradingService>;
};

export const tweetTradingServiceFactory: FactoryProvider = {
  provide: TweetTradingServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    twitterSignalsService: TwitterSignalsService,
    logger: Logger,
  ): TweetTradingServiceFactory => {
    return {
      fromContext: (ctx) => {
        const { exchangeAccount, threeCommasAccount } = ctx;

        const exchangeService = exchangeFactory
          .useFactory(httpService, configService)
          .createFromExchangeAccount(exchangeAccount);

        const threeCommasApiService = threeCommasApiServiceFactory
          .useFactory(httpService, configService)
          .createFromAccount(threeCommasAccount);

        return new TweetTradingService(
          twitterSignalsService,
          threeCommasApiService,
          logger,
          firestoreService,
          exchangeService,
        );
      },
      fromBotId: async (botId: string) => {
        const bot = await firestoreService.tweetTradingBots.findOne(botId);
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          bot.exchangeAccountId,
        );
        const threeCommasAccount =
          await firestoreService.threeCommasAccount.findOne(
            bot.threeCommasAccountId,
          );

        const exchangeService = exchangeFactory
          .useFactory(httpService, configService)
          .createFromExchangeAccount(exchangeAccount);

        const threeCommasApiService = threeCommasApiServiceFactory
          .useFactory(httpService, configService)
          .createFromAccount(threeCommasAccount);

        return new TweetTradingService(
          twitterSignalsService,
          threeCommasApiService,
          logger,
          firestoreService,
          exchangeService,
        );
      },
    };
  },
  inject: [
    HttpService,
    ConfigService,
    FirestoreService,
    TwitterSignalsService,
    Logger,
  ],
};
