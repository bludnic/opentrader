import { ExchangeCode } from '@bifrost/types';
import { IExchangeCredentials } from 'src/core/db/types/entities/exchange-accounts/exchange-credentials/exchange-credentials.interface';

export class ExchangeCredentialsEntity implements IExchangeCredentials {
  code: ExchangeCode;
  apiKey: string;
  secretKey: string;
  passphrase: string; // or password (depends on the exchange)
  isDemoAccount: boolean;

  constructor(credentials: IExchangeCredentials) {
    Object.assign(this, credentials);
  }
}
