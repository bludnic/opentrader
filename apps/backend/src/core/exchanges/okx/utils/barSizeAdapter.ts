/**
 * Convert `BarSize` to `OKXBarSize`
 */
import { BarSize } from '@bifrost/types';
import { OKXBarSize } from 'src/core/exchanges/okx/types/client/market-data/common/bar-size.type';

const barSizeInputMap: Record<BarSize, OKXBarSize> = {
  [BarSize.ONE_MINUTE]: '1m',
  [BarSize.FIVE_MINUTES]: '5m',
  [BarSize.FIFTEEN_MINUTES]: '15m',
  [BarSize.ONE_HOUR]: '1H',
  [BarSize.FOUR_HOURS]: '4H',
  [BarSize.ONE_DAY]: '1D',
  [BarSize.ONE_WEEK]: '1W',
  [BarSize.ONE_MONTH]: '1M',
  [BarSize.THREE_MONTHS]: '3M',
};

const barSizeOutputMap: Partial<Record<OKXBarSize, BarSize>> = {
  '1m': BarSize.ONE_MINUTE,
  '5m': BarSize.FIVE_MINUTES,
  '15m': BarSize.FIFTEEN_MINUTES,
  '1H': BarSize.ONE_HOUR,
  '4H': BarSize.FOUR_HOURS,
  '1D': BarSize.ONE_DAY,
  '1W': BarSize.ONE_WEEK,
  '1M': BarSize.ONE_MONTH,
  '3M': BarSize.THREE_MONTHS,
};

export function barSizeInputAdapter(barSize: BarSize): OKXBarSize {
  return barSizeInputMap[barSize];
}

export function barSizeOutputAdapter(okxBarSize: OKXBarSize): BarSize {
  return barSizeOutputMap[okxBarSize];
}
