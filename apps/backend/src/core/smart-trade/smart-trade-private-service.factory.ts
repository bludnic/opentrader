import { exchanges } from '@bifrost/exchanges';
import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { SmartTradePrivateService } from './smart-trade-private.service';

export const SmartTradePrivateServiceFactorySymbol = Symbol(
  'SmartTradePrivateServiceFactory',
);

export type SmartTradePrivateServiceFactory = {
  fromExchangeAccount: (account: IExchangeAccount) => SmartTradePrivateService;
  fromExchangeAccountId: (
    exchangeAccountId: string,
  ) => Promise<SmartTradePrivateService>;
  fromSmartTradeId: (smartTradeId: string) => Promise<SmartTradePrivateService>;
};

export const smartTradePrivateServiceFactory: FactoryProvider = {
  provide: SmartTradePrivateServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger,
  ): SmartTradePrivateServiceFactory => {
    return {
      fromExchangeAccount: (exchangeAccount: IExchangeAccount) => {
        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new SmartTradePrivateService(
          exchangeService,
          firestoreService,
          logger,
        );
      },
      fromExchangeAccountId: async (exchangeAccountId: string) => {
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new SmartTradePrivateService(
          exchangeService,
          firestoreService,
          logger,
        );
      },
      fromSmartTradeId: async (smartTradeId: string) => {
        const smartTrade = await firestoreService.smartTrade.findOne(
          smartTradeId,
        );

        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          smartTrade.exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new SmartTradePrivateService(
          exchangeService,
          firestoreService,
          logger,
        );
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
