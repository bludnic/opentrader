import { FactoryProvider } from '@nestjs/common';
import { IExchangeAccount } from 'src/core/db/firestore/collections/exchange-accounts/exchange-account.interface';

export const DefaultExchangeContext = Symbol('DefaultExchangeContext');

export const defaultExchangeContext: FactoryProvider = {
  provide: DefaultExchangeContext,
  useFactory: (): IExchangeAccount => {
    return null; // @todo throw somehow error
  },
  inject: [],
};
