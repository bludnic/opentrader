import { exchanges } from '@bifrost/exchanges';
import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TradeBotOrdersService } from './trade-bot-orders.service';

export const TradeBotOrderServiceFactorySymbol = Symbol(
  'TradeBotOrdersServiceFactory',
);

export type TradeBotOrdersServiceFactory = {
  fromBotId: (botId: string) => Promise<TradeBotOrdersService>;
};

export const tradeBotOrdersServiceFactory: FactoryProvider = {
  provide: TradeBotOrderServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger,
  ): TradeBotOrdersServiceFactory => {
    return {
      fromBotId: async (botId: string) => {
        const bot = await firestoreService.tradeBot.findOne(botId);
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          bot.exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new TradeBotOrdersService(
          bot,
          exchangeService,
          firestoreService,
          logger,
        );
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
