import { IThreeCommasAccountCredentials } from 'src/core/db/types/entities/3commas-accounts/account-credentials/3commas-account-credentials.interface';

export interface IThreeCommasAccount {
  id: string;
  name: string;
  credentials: IThreeCommasAccountCredentials;

  createdAt: number;
  userId: string; // owner of the document
}
