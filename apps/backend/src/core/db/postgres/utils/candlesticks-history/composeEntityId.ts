import { BarSize } from '@bifrost/types';
import { SYMBOL_BAR_SIZE_SEPARATOR } from './constants';

export function composeEntityId(symbolId: string, barSize: BarSize) {
  return symbolId + SYMBOL_BAR_SIZE_SEPARATOR + barSize;
}
