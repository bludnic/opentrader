import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeCredentials } from 'src/core/db/types/entities/exchange-accounts/exchange-credentials/exchange-credentials.interface';

export interface IExchangeAccount {
  id: string;
  name: string;
  exchangeCode: ExchangeCode;
  credentials: IExchangeCredentials;
  userId: string; // owner of the document
  createdAt: number;
}
