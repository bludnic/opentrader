import { FactoryProvider } from '@nestjs/common';
import { ThreeCommasApiServiceFactorySymbol } from 'src/shared/3commas-api/3commas-api-service.factory';
import { ThreeCommasApiService } from 'src/shared/3commas-api/3commas-api.service';

export const default3CommasApiServiceProvider: FactoryProvider = {
  provide: ThreeCommasApiServiceFactorySymbol,
  useFactory: (): ThreeCommasApiService => {
    return null; // @todo throw somehow error
  },
  inject: [],
};
