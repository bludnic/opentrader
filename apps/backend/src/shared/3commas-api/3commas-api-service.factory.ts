import { HttpService } from '@nestjs/axios';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IThreeCommasAccount } from 'src/core/db/types/entities/3commas-accounts/account/3commas-account.interface';
import { SmartTradesService } from 'src/shared/3commas-api/services/smart-trades.service';
import { getContextByAccount } from 'src/shared/3commas-api/utils/contexts/getContextByAccount';
import { ThreeCommasApiService } from './3commas-api.service';
import { ThreeCommasApiClient } from './3commas-api-client.factory';

export const ThreeCommasApiServiceFactorySymbol = Symbol('ThreeCommasApiServiceFactory');

export type ThreeCommasApiServiceFactory = {
  createFromAccount: (
    threeCommasAccount: IThreeCommasAccount,
  ) => ThreeCommasApiService;
  createFromAccountId: (
    accountId: IThreeCommasAccount['id'],
  ) => Promise<ThreeCommasApiService>;
};

export const threeCommasApiServiceFactory: FactoryProvider = {
  provide: ThreeCommasApiServiceFactorySymbol,
  useFactory: (
    httpService: HttpService,
    configService: ConfigService,
    firestoreService: FirestoreService,
  ): ThreeCommasApiServiceFactory => {
    return {
      createFromAccount: (threeCommasAccount) => {
        const ctx = getContextByAccount(threeCommasAccount);

        const apiClient = ThreeCommasApiClient.fromContext(ctx);

        const service = new SmartTradesService(apiClient);

        return new ThreeCommasApiService(service);
      },
      createFromAccountId: async (accountId: IThreeCommasAccount['id']) => {
        const threeCommasAccount =
          await firestoreService.threeCommasAccount.findOne(accountId);

        const ctx = getContextByAccount(threeCommasAccount);

        const apiClient = ThreeCommasApiClient.fromContext(ctx);

        const service = new SmartTradesService(apiClient);

        return new ThreeCommasApiService(service);
      },
    };
  },
  inject: [HttpService, ConfigService, FirestoreService],
};
