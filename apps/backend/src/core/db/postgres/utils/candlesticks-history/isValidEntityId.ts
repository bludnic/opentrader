import { isValidSymbolId } from '@bifrost/tools';
import { BarSize } from '@bifrost/types';
import { SYMBOL_BAR_SIZE_SEPARATOR } from './constants';

export function isValidEntityId(entityId: string) {
  const [symbolId, barSize] = entityId.split(SYMBOL_BAR_SIZE_SEPARATOR);

  const isValidSymbol = isValidSymbolId(symbolId);
  const isValidBarSize = Object.values(BarSize).includes(barSize as BarSize);

  return isValidSymbol && isValidBarSize;
}
