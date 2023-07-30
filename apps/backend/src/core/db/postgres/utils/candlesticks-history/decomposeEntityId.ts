import { BarSize } from '@bifrost/types';
import { isValidEntityId } from './isValidEntityId';
import { SYMBOL_BAR_SIZE_SEPARATOR } from './constants';

type Result = {
  symbolId: string;
  barSize: BarSize;
};

export function decomposeEntityId(entityId: string): Result {
  if (!isValidEntityId(entityId)) {
    throw new Error(`${entityId} is not a valid entityId`);
  }

  const [symbolId, barSize] = entityId.split(SYMBOL_BAR_SIZE_SEPARATOR);

  return {
    symbolId,
    barSize: barSize as BarSize,
  };
}
