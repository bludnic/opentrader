import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CandlesticksHistoryRepository } from 'src/core/db/postgres/repositories/candlesticks-history.repository';
import { CandlesticksRepository } from 'src/core/db/postgres/repositories/candlesticks.repository';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { getExchangeContextByAccount } from 'src/core/exchanges/utils/contexts';
import { DataSource } from 'typeorm';

import { FactoryProvider, Logger } from '@nestjs/common';
import { CandlesticksService } from 'src/candlesticks/candlesticks.service';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';

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

        const ctx = getExchangeContextByAccount(exchangeAccount);

        switch (exchangeAccount.credentials.code) {
          case ExchangeCode.OKX: {
            const clientService = new OKXClientService(
              httpService,
              configService,
              ctx,
            );
            const exchangeService = new OkxExchangeService(clientService);

            return new CandlesticksService(
              exchangeService,
              logger,
              candlesticksHistory,
              candlestick,
              dataSource,
            );
          }
        }
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
