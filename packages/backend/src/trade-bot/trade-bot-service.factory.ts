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
import { TradeBotService } from './trade-bot.service';

export const TradeBotServiceFactorySymbol = Symbol('TradeBotServiceFactory');

export type TradeBotServiceFactory = {
  create: (exchange: IExchangeContext) => TradeBotService;
  fromExchangeAccount: (account: IExchangeAccount) => TradeBotService;
  fromExchangeAccountId: (exchangeAccountId: string) => Promise<TradeBotService>;
  fromBotId: (botId: string) => Promise<TradeBotService>;
};

export const tradeBotServiceFactory: FactoryProvider = {
  provide: TradeBotServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger
  ): TradeBotServiceFactory => {
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

            return new TradeBotService(
              exchangeService,
              firestoreService,
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

            return new TradeBotService(
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

            return new TradeBotService(
              exchangeService,
              firestoreService,
              logger,
            );
          }
        }
      },
      fromBotId: async (botId: string) => {
        const bot = await firestoreService.tradeBot.findOne(botId);
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

            return new TradeBotService(
              exchangeService,
              firestoreService,
              logger,
            );
          }
        }
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
