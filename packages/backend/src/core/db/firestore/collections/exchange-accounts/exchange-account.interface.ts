import { ExchangeCode } from 'src/core/db/firestore/collections/exchange-accounts/enums/exchange-code.enum';
import { IExchangeCredentials } from './types/exchange-credentials.interface';

export interface IExchangeAccount {
  id: string;
  name: string;
  exchangeCode: ExchangeCode;
  credentials: IExchangeCredentials;
  userId: string; // owner of the document
}
