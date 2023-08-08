import { HttpService } from '@nestjs/axios';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ConfigService } from '@nestjs/config';
import { ExchangeCode } from '@bifrost/types';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { getExchangeContextByAccount } from 'src/core/exchanges/utils/contexts';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

export const ExchangeFactorySymbol = Symbol('ExchangeFactory');

export type ExchangeFactory = {
  create: (exchange: IExchangeContext) => IExchangeService;
  createFromExchangeAccount: (
    exchangeAccount: IExchangeAccount,
  ) => IExchangeService;
  createFromExchangeAccountId: (
    exchangeAccountId: string,
  ) => Promise<IExchangeService>;
};

export const exchangeFactory: FactoryProvider = {
  provide: ExchangeFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService
  ): ExchangeFactory => {
    return {
      create: (exchangeCtx) => {
        const { exchangeAccount } = exchangeCtx;

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const service = new OKXClientService(
              httpService,
              configService,
              exchangeCtx,
            );

            return new OkxExchangeService(service);
          }
        }
      },
      createFromExchangeAccount: (exchangeAccount: IExchangeAccount) => {
        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const service = new OKXClientService(
              httpService,
              configService,
              ctx,
            );

            return new OkxExchangeService(service);
          }
        }
      },
      createFromExchangeAccountId: async (exchangeAccountId) => {
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          exchangeAccountId,
        );

        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const service = new OKXClientService(
              httpService,
              configService,
              ctx,
            );

            return new OkxExchangeService(service);
          }
        }
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService],
};
