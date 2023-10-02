import { BarSize } from '@opentrader/types';

export function stringToBarSize(timeframe: string): BarSize {
  const validTimeframes = Object.values(BarSize);

  if (validTimeframes.includes(timeframe as any)) {
    return timeframe as BarSize;
  }

  throw new Error(`Cannot map ${timeframe} to BarSize enum`);
}
