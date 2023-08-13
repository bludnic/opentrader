import { exchanges, IExchange } from '@bifrost/exchanges';
import { HttpService } from '@nestjs/axios';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ConfigService } from '@nestjs/config';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

export const ExchangeFactorySymbol = Symbol('ExchangeFactory');

export type ExchangeFactory = {
  createFromExchangeAccount: (exchangeAccount: IExchangeAccount) => IExchange;
  createFromExchangeAccountId: (
    exchangeAccountId: string,
  ) => Promise<IExchange>;
};

export const exchangeFactory: FactoryProvider = {
  provide: ExchangeFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
  ): ExchangeFactory => {
    return {
      createFromExchangeAccount: (exchangeAccount: IExchangeAccount) => {
        return exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );
      },
      createFromExchangeAccountId: async (exchangeAccountId) => {
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          exchangeAccountId,
        );

        return exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService],
};
