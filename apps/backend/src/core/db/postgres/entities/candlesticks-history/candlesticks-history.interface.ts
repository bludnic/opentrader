import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { ExchangeCode } from '@bifrost/types';

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
