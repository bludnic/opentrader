import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { IExchangeConfig } from 'src/core/exchanges/types/exchange-config.interface';

export interface IExchangeContext {
  exchangeConfig: IExchangeConfig;
  exchangeAccount: IExchangeAccount;
}
