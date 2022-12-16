import { FactoryProvider } from '@nestjs/common';
import { DefaultExchangeService } from 'src/core/exchanges/utils/default-exchange.service';

export const DefaultExchangeServiceFactorySymbol = Symbol(
  'DefaultExchangeFactory',
);

export const defaultExchangeServiceProvider: FactoryProvider = {
  provide: DefaultExchangeServiceFactorySymbol,
  useFactory: (): DefaultExchangeService => {
    return new DefaultExchangeService();
  },
  inject: [],
};
