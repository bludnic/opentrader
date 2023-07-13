import { IThreeCommasAccount } from 'src/core/db/types/entities/3commas-accounts/account/3commas-account.interface';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';

export interface ITweetTradingContext {
  exchangeAccount: IExchangeAccount;
  threeCommasAccount: IThreeCommasAccount;
}
