import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { getExchangeConfig } from 'src/core/exchanges/utils/configs';

export function getExchangeContextByAccount(
  exchangeAccount: IExchangeAccount,
): IExchangeContext {
  return {
    exchangeConfig: getExchangeConfig(exchangeAccount.credentials.code),
    exchangeAccount,
  };
}
