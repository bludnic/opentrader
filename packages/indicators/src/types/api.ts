import type { ExchangeCode, IndicatorBarSize } from "@opentrader/types";

export type OHLCVRequest = {
  exchangeCode: ExchangeCode;
  /**
   * e.g. "BTC/USDT"
   */
  symbol: string;
  /**
   * ISO 8601 date string, e.g. "2024-01-14T23:50:00Z"
   */
  untilDate: string;
  limit: number;
  barSize: IndicatorBarSize;
};

export type OHLCVData = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type OHLCVResponse = {
  result: {
    data: OHLCVData[];
  };
};
