import { IExchangeAccount } from 'src/core/db/firestore/collections/exchange-accounts/exchange-account.interface';
import { IExchangeCredentials } from './types/exchange-credentials.interface';

export class ExchangeAccountDto implements IExchangeAccount {
  exchangeRef: object; // reference
  name: string;
  credentials: IExchangeCredentials;
}
