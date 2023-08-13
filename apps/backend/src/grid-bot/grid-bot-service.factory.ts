import { exchanges } from '@bifrost/exchanges';
import { HttpService } from '@nestjs/axios';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { SmartTradePrivateService } from 'src/core/smart-trade/smart-trade-private.service';
import { SmartTradePublicService } from 'src/core/smart-trade/smart-trade-public.service';

import { GridBotService } from 'src/grid-bot/grid-bot.service';

export const GridBotServiceFactorySymbol = Symbol('GridBotServiceFactory');

export type GridBotServiceFactory = {
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
    logger: Logger,
  ): GridBotServiceFactory => {
    return {
      fromExchangeAccount: (exchangeAccount: IExchangeAccount) => {
        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        const smartTradePublicService = new SmartTradePublicService(
          firestoreService,
          logger,
        );
        const smartTradePrivateService = new SmartTradePrivateService(
          exchangeService,
          firestoreService,
          logger,
        );

        return new GridBotService(
          exchangeService,
          firestoreService,
          smartTradePublicService,
          smartTradePrivateService,
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

        const smartTradePublicService = new SmartTradePublicService(
          firestoreService,
          logger,
        );
        const smartTradePrivateService = new SmartTradePrivateService(
          exchangeService,
          firestoreService,
          logger,
        );

        return new GridBotService(
          exchangeService,
          firestoreService,
          smartTradePublicService,
          smartTradePrivateService,
          logger,
        );
      },
      fromBotId: async (botId: string) => {
        const bot = await firestoreService.gridBot.findOne(botId);
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          bot.exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        const smartTradePublicService = new SmartTradePublicService(
          firestoreService,
          logger,
        );
        const smartTradePrivateService = new SmartTradePrivateService(
          exchangeService,
          firestoreService,
          logger,
        );

        return new GridBotService(
          exchangeService,
          firestoreService,
          smartTradePublicService,
          smartTradePrivateService,
          logger,
        );
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService, Logger],
};
