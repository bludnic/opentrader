import { ExchangeCode } from 'src/core/db/firestore/collections/exchange-accounts/enums/exchange-code.enum';

export interface IExchangeCredentials {
  code: ExchangeCode;
  apiKey: string;
  secretKey: string;
  passphrase: string; // or password (depends on the exchange)
  isDemoAccount: boolean;
}
