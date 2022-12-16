import { IExchangeAccount } from 'src/core/db/firestore/collections/exchange-accounts/exchange-account.interface';
import { IExchangeConfig } from 'src/core/exchanges/types/exchange-config.interface';

export interface IExchangeContext {
  exchangeConfig: IExchangeConfig;
  exchangeAccount: IExchangeAccount;
}
