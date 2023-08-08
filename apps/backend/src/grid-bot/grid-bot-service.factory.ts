import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeCode } from '@bifrost/types';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { getExchangeContextByAccount } from 'src/core/exchanges/utils/contexts';
import { SmartTradePrivateService } from 'src/core/smart-trade/smart-trade-private.service';
import { SmartTradePublicService } from 'src/core/smart-trade/smart-trade-public.service';

import { GridBotService } from 'src/grid-bot/grid-bot.service';

export const GridBotServiceFactorySymbol = Symbol('GridBotServiceFactory');

export type GridBotServiceFactory = {
  create: (exchange: IExchangeContext) => GridBotService;
  fromExchangeAccount: (account: IExchangeAccount) => GridBotService;
  fromExchangeAccountId: (exchangeAccountId: string) => Promise<GridBotService>;
  fromBotId: (botId: string) => Promise<GridBotService>;
};

export const gridBotServiceFactory: FactoryProvider = {
  provide: GridBotServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger
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
            const smartTradePublicService = new SmartTradePublicService(
              firestoreService,
              logger
            );
            const smartTradePrivateService = new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger
            );

            return new GridBotService(
              exchangeService,
              firestoreService,
              smartTradePublicService,
              smartTradePrivateService,
              logger,
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
            const smartTradePublicService = new SmartTradePublicService(
              firestoreService,
              logger
            );
            const smartTradePrivateService = new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger
            );

            return new GridBotService(
              exchangeService,
              firestoreService,
              smartTradePublicService,
              smartTradePrivateService,
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
            const smartTradePublicService = new SmartTradePublicService(
              firestoreService,
              logger
            );
            const smartTradePrivateService = new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger
            );

            return new GridBotService(
              exchangeService,
              firestoreService,
              smartTradePublicService,
              smartTradePrivateService,
              logger,
            );
          }
        }
      },
      fromBotId: async (botId: string) => {
        const bot = await firestoreService.gridBot.findOne(botId);
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          bot.exchangeAccountId,
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
            const smartTradePublicService = new SmartTradePublicService(
              firestoreService,
              logger
            );
            const smartTradePrivateService = new SmartTradePrivateService(
              exchangeService,
              firestoreService,
              logger
            );

            return new GridBotService(
              exchangeService,
              firestoreService,
              smartTradePublicService,
              smartTradePrivateService,
              logger,
            );
          }
        }
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
