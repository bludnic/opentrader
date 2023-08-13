import { exchanges } from '@bifrost/exchanges';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { DataSource } from 'typeorm';

import { FactoryProvider, Logger } from '@nestjs/common';
import { CandlesticksService } from 'src/candlesticks/candlesticks.service';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

export const CandlesticksServiceFactorySymbol = Symbol(
  'CandlesticksServiceFactory',
);

export type CandlesticksServiceFactory = {
  fromExchangeAccountId: (
    exchangeAccountId: string,
  ) => Promise<CandlesticksService>;
};

export const candlesticksServiceFactory: FactoryProvider = {
  provide: CandlesticksServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
    logger: Logger,
    candlesticksHistory: CandlesticksHistoryRepository,
    candlestick: CandlesticksRepository,
    dataSource: DataSource,
  ): CandlesticksServiceFactory => {
    return {
      fromExchangeAccountId: async (exchangeAccountId: string) => {
        const exchangeAccount = await firestoreService.exchangeAccount.findOne(
          exchangeAccountId,
        );

        const exchangeService = exchanges[exchangeAccount.credentials.code](
          exchangeAccount.credentials,
        );

        return new CandlesticksService(
          exchangeService,
          logger,
          candlesticksHistory,
          candlestick,
          dataSource,
        );
      },
    };
  },
  inject: [
    HttpService,
    ConfigService,
    FirestoreService,
    Logger,
    CandlesticksHistoryRepository,
    CandlesticksRepository,
    DataSource,
  ],
};
