import { ExchangeCode } from '@bifrost/types';

export interface IExchangeCredentials {
  code: ExchangeCode;
  apiKey: string;
  secretKey: string;
  passphrase: string; // or password (depends on the exchange)
  isDemoAccount: boolean;
}
