import { IExchangeCredentials } from './types/exchange-credentials.interface';

export interface IExchangeAccount {
  exchangeRef: object; // reference @todo найти тип
  name: string;
  credentials: IExchangeCredentials;
}
