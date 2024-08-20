import type { BarSize, ExchangeCode } from '@opentrader/types';

export type IBotConfiguration<T = any> = {
  id: number;
  symbol: string;
  exchangeCode: ExchangeCode;
  settings: T;
  timeframe?: BarSize | null;
};
