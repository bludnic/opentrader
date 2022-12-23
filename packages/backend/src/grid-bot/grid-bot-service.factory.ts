import { HttpService } from '@nestjs/axios';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { getExchangeContextByAccount } from 'src/core/exchanges/utils/contexts';

import { GridBotService } from 'src/grid-bot/grid-bot.service';

export const GridBotServiceFactorySymbol = Symbol('GridBotServiceFactory');

export type GridBotServiceFactory = {
  create: (exchange: IExchangeContext) => GridBotService;
  fromExchangeAccount: (account: IExchangeAccount) => GridBotService;
};

export const gridBotServiceFactory: FactoryProvider = {
  provide: GridBotServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
  ): GridBotServiceFactory => {
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

            return new GridBotService(exchangeService, firestoreService);
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

            return new GridBotService(exchangeService, firestoreService);
          }
        }
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService],
};
