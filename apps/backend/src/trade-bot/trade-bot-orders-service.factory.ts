import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeCode } from '@bifrost/types';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { getExchangeContextByAccount } from 'src/core/exchanges/utils/contexts';
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

        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const clientService = new OKXClientService(
              httpService,
              configService,
              ctx,
            );
            const exchangeService = new OkxExchangeService(clientService);

            return new TradeBotOrdersService(
              bot,
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
