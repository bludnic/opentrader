import { IOKXGetAccountBalanceDetails } from './get-account-balance-details.interface';

export interface IOKXGetAccountBalance {
  /**
   * Update time of account information, millisecond format of Unix timestamp, e.g. `1597026383085`
   */
  uTime: string;
  /**
   * Total equity in USD level
   */
  totalEq: string;
  isoEq: string;
  adjEq: string;
  ordFroz: string;
  imr: string;
  mmr: string;
  mgnRatio: string;
  notionalUsd: string;
  details: Array<IOKXGetAccountBalanceDetails>;
}
