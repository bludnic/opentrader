import { ExchangeCode, ICandlestick } from '@bifrost/types';

export interface ICandlesticksHistory {
  exchangeCode: ExchangeCode;
  baseCurrency: string;
  quoteCurrency: string;
  candlesticks: ICandlestick[];
  /**
   * Set to `true` if there are no more history candles
   */
  historyDataDownloadingCompleted: boolean;
  updatedAt: number;
}
