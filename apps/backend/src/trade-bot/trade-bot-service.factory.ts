import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { exchanges } from '@bifrost/exchanges';

import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { TradeBotService } from './trade-bot.service';

export const TradeBotServiceFactorySymbol = Symbol('TradeBotServiceFactory');

export type TradeBotServiceFactory = {
  fromExchangeAccount: (account: IExchangeAccount) => TradeBotService;
  fromExchangeAccountId: (
    exchangeAccountId: string,
  ) => Promise<TradeBotService>;
  fromBotId: (botId: string) => Promise<TradeBotService>;
};

export const tradeBotServiceFactory: FactoryProvider = {
  provide: TradeBotServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger,
  ): TradeBotServiceFactory => {
    return {
      fromExchangeAccount: (exchangeAccount: IExchangeAccount) => {
        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new TradeBotService(exchangeService, firestoreService, logger);
      },
      fromExchangeAccountId: async (exchangeAccountId: string) => {
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new TradeBotService(exchangeService, firestoreService, logger);
      },
      fromBotId: async (botId: string) => {
        const bot = await firestoreService.tradeBot.findOne(botId);
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          bot.exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new TradeBotService(exchangeService, firestoreService, logger);
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
