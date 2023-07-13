import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';

export interface ICandlesticksHistory {
  exchangeCode: ExchangeCode;
  candlesticks: ICandlestick[];
  /**
   * Earliest candlestick opening time `(ICandlestick['open'])`
   */
  earliestCandleTimestamp?: number;
  /**
   * Newest candlestick opening time `(ICandlestick['open'])`
   */
  newestCandleTimestamp?: number;
  /**
   * Set to `true` if there are no more history candles
   */
  historyDataDownloadingCompleted: boolean;
  updatedAt: number;
}
