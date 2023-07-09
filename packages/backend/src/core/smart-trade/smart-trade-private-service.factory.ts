import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { getExchangeContextByAccount } from 'src/core/exchanges/utils/contexts';
import { SmartTradePrivateService } from './smart-trade-private.service';

export const SmartTradePrivateServiceFactorySymbol = Symbol('SmartTradePrivateServiceFactory');

export type SmartTradePrivateServiceFactory = {
  create: (exchange: IExchangeContext) => SmartTradePrivateService;
  fromExchangeAccount: (account: IExchangeAccount) => SmartTradePrivateService;
  fromExchangeAccountId: (exchangeAccountId: string) => Promise<SmartTradePrivateService>;
  fromSmartTradeId: (smartTradeId: string) => Promise<SmartTradePrivateService>;
};

export const smartTradePrivateServiceFactory: FactoryProvider = {
  provide: SmartTradePrivateServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger
  ): SmartTradePrivateServiceFactory => {
    return {
      create: (ctx) => {
        const { exchangeAccount, exchangeConfig } = ctx;

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const clientService = new OKXClientService(
              httpService,
              configService,
              ctx,
            );
            const exchangeService = new OkxExchangeService(clientService);

            return new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger
            );
          }
        }
      },
      fromExchangeAccount: (exchangeAccount: IExchangeAccount) => {
        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const clientService = new OKXClientService(
              httpService,
              configService,
              ctx,
            );
            const exchangeService = new OkxExchangeService(clientService);

            return new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger,
            );
          }
        }
      },
      fromExchangeAccountId: async (exchangeAccountId: string) => {
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          exchangeAccountId,
        );

        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const clientService = new OKXClientService(
              httpService,
              configService,
              ctx,
            );
            const exchangeService = new OkxExchangeService(clientService);

            return new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger,
            );
          }
        }
      },
      fromSmartTradeId: async (smartTradeId: string) => {
        const smartTrade = await firestoreService.smartTrade.findOne(smartTradeId);

        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          smartTrade.exchangeAccountId
        );

        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const clientService = new OKXClientService(
              httpService,
              configService,
              ctx,
            );
            const exchangeService = new OkxExchangeService(clientService);

            return new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger,
            );
          }
        }
      }
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
