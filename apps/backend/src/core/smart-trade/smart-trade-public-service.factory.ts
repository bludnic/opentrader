import { FactoryProvider, Logger } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { SmartTradePublicService } from './smart-trade-public.service';

export const SmartTradePublicServiceFactorySymbol = Symbol('SmartTradePublicServiceFactory');

export type SmartTradePublicServiceFactory = {
  create: () => SmartTradePublicService;
};

export const smartTradePublicServiceFactory: FactoryProvider = {
  provide: SmartTradePublicServiceFactorySymbol,
  useFactory: (
    firestoreService: FirestoreService,
    logger: Logger
  ): SmartTradePublicServiceFactory => {
    return {
      create: () => {
        return new SmartTradePublicService(
          firestoreService,
          logger
        );
      }
    };
  },
  inject: [FirestoreService, Logger],
};
